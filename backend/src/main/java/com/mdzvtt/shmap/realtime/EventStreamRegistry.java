package com.mdzvtt.shmap.realtime;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.ContextClosedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.mdzvtt.shmap.configuration.JwtService;
import com.mdzvtt.shmap.token.TokenRepository;

import java.io.IOException;
import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;
import java.util.concurrent.atomic.AtomicBoolean;

@Slf4j
@Component
public class EventStreamRegistry {
    private final RealtimeProperties properties;
    private final JwtService jwtService;
    private final TokenRepository tokenRepository;
    private final Map<Integer, Set<EventStream>> streams = new ConcurrentHashMap<>();

    public EventStreamRegistry(RealtimeProperties properties, JwtService jwtService,
            TokenRepository tokenRepository) {
        this.properties = properties;
        this.jwtService = jwtService;
        this.tokenRepository = tokenRepository;
    }

    public SseEmitter open(Integer userId, String token) {
        SseEmitter emitter = new SseEmitter(timeoutFor(token).toMillis());
        EventStream stream = new EventStream(emitter, token);
        EventStream oldest = register(userId, stream);

        Runnable remove = () -> remove(userId, stream);
        emitter.onCompletion(remove);
        emitter.onTimeout(() -> {
            remove.run();
            emitter.complete();
        });
        emitter.onError(error -> remove.run());

        log.info("Stream opened for user {} ({} open on this instance)", userId, openCount());

        if (oldest != null) {
            remove(userId, oldest);
            oldest.emitter().complete();
        }

        try {
            emitter.send(SseEmitter.event().name("ready").data(Map.of()));
        } catch (IOException e) {
            remove.run();
            emitter.completeWithError(e);
        }
        return emitter;
    }

    @Scheduled(fixedDelayString = "${app.realtime.heartbeat-interval}")
    void sendHeartbeats() {
        streams.forEach((userId, emitters) -> {
            for (EventStream stream : emitters) {
                try {
                    stream.emitter().send(SseEmitter.event().comment(""));
                } catch (IOException | IllegalStateException e) {
                    remove(userId, stream);
                }
            }
        });
    }

    public void send(Set<Integer> userIds, String eventName, Object data) {
        for (Integer userId : userIds) {
            Set<EventStream> userStreams = streams.get(userId);
            if (userStreams == null) {
                continue;
            }
            for (EventStream stream : userStreams) {
                try {
                    stream.emitter().send(SseEmitter.event().name(eventName).data(data));
                } catch (IOException | IllegalStateException e) {
                    remove(userId, stream);
                }
            }
        }
    }

    void closeRevokedStreams(Integer userId) {
        Set<EventStream> userStreams = streams.get(userId);
        if (userStreams == null) {
            return;
        }
        for (EventStream stream : userStreams) {
            if (!isTokenActive(stream.token())) {
                remove(userId, stream);
                stream.emitter().complete();
            }
        }
    }

    @EventListener(ContextClosedEvent.class)
    void closeAll() {
        closeAllStreams();
    }

    int closeAllStreams() {
        int count = openCount();
        streams.values().forEach(userStreams -> userStreams.forEach(stream -> stream.emitter().complete()));
        return count;
    }

    private EventStream register(Integer userId, EventStream stream) {
        EventStream[] evicted = new EventStream[1];
        streams.compute(userId, (id, emitters) -> {
            Set<EventStream> userStreams = emitters == null ? new CopyOnWriteArraySet<>() : emitters;
            userStreams.add(stream);
            if (userStreams.size() > properties.maxStreamsPerUser()) {
                evicted[0] = userStreams.iterator().next();
            }
            return userStreams;
        });
        return evicted[0];
    }

    private void remove(Integer userId, EventStream stream) {
        AtomicBoolean removed = new AtomicBoolean();
        streams.computeIfPresent(userId, (id, emitters) -> {
            removed.set(emitters.remove(stream));
            return emitters.isEmpty() ? null : emitters;
        });
        if (removed.get()) {
            log.info("Stream closed for user {} ({} open on this instance)", userId, openCount());
        }
    }

    private boolean isTokenActive(String token) {
        return tokenRepository.findByToken(token)
                .map(stored -> !stored.isExpired() && !stored.isRevoked())
                .orElse(false);
    }

    private Duration timeoutFor(String token) {
        Instant expiresAt = jwtService.extractClaim(token, claims -> claims.getExpiration()).toInstant();
        Duration untilExpiry = Duration.between(Instant.now(), expiresAt);
        Duration timeout = untilExpiry.compareTo(properties.streamTimeout()) < 0 ? untilExpiry
                : properties.streamTimeout();
        return timeout.isPositive() ? timeout : Duration.ofMillis(1);
    }

    private int openCount() {
        return streams.values().stream().mapToInt(set -> set.size()).sum();
    }
}
