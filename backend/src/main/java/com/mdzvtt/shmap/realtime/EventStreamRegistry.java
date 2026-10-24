package com.mdzvtt.shmap.realtime;

import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;
import java.util.concurrent.atomic.AtomicBoolean;

@Slf4j
@Component
public class EventStreamRegistry {
    private final RealtimeProperties properties;
    private final Map<Integer, Set<SseEmitter>> streams = new ConcurrentHashMap<>();

    public EventStreamRegistry(RealtimeProperties properties) {
        this.properties = properties;
    }

    public SseEmitter open(Integer userId) {
        SseEmitter emitter = new SseEmitter(properties.streamTimeout().toMillis());
        SseEmitter oldest = register(userId, emitter);

        Runnable remove = () -> remove(userId, emitter);
        emitter.onCompletion(remove);
        emitter.onTimeout(() -> {
            remove.run();
            emitter.complete();
        });
        emitter.onError(error -> remove.run());

        log.info("Stream opened for user {} ({} open on this instance)", userId, openCount());

        if (oldest != null) {
            remove(userId, oldest);
            oldest.complete();
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
            for (SseEmitter emitter : emitters) {
                try {
                    emitter.send(SseEmitter.event().comment(""));
                } catch (IOException | IllegalStateException e) {
                    remove(userId, emitter);
                }
            }
        });
    }

    private SseEmitter register(Integer userId, SseEmitter emitter) {
        SseEmitter[] evicted = new SseEmitter[1];
        streams.compute(userId, (id, emitters) -> {
            Set<SseEmitter> userStreams = emitters == null ? new CopyOnWriteArraySet<>() : emitters;
            userStreams.add(emitter);
            if (userStreams.size() > properties.maxStreamsPerUser()) {
                evicted[0] = userStreams.iterator().next();
            }
            return userStreams;
        });
        return evicted[0];
    }

    private void remove(Integer userId, SseEmitter emitter) {
        AtomicBoolean removed = new AtomicBoolean();
        streams.computeIfPresent(userId, (id, emitters) -> {
            removed.set(emitters.remove(emitter));
            return emitters.isEmpty() ? null : emitters;
        });
        if (removed.get()) {
            log.info("Stream closed for user {} ({} open on this instance)", userId, openCount());
        }
    }

    private int openCount() {
        return streams.values().stream().mapToInt(Set::size).sum();
    }
}
