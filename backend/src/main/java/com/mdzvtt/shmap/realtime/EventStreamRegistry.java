package com.mdzvtt.shmap.realtime;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;

@Component
public class EventStreamRegistry {
    private static final Duration STREAM_TIMEOUT = Duration.ofMinutes(55);

    private final Map<Integer, Set<SseEmitter>> streams = new ConcurrentHashMap<>();

    public SseEmitter open(Integer userId) {
        SseEmitter emitter = new SseEmitter(STREAM_TIMEOUT.toMillis());
        streams.computeIfAbsent(userId, id -> new CopyOnWriteArraySet<>()).add(emitter);

        Runnable remove = () -> remove(userId, emitter);
        emitter.onCompletion(remove);
        emitter.onTimeout(remove);
        emitter.onError(error -> remove.run());

        try {
            emitter.send(SseEmitter.event().name("ready").data(Map.of()));
        } catch (IOException e) {
            remove.run();
            emitter.completeWithError(e);
        }
        return emitter;
    }

    private void remove(Integer userId, SseEmitter emitter) {
        streams.computeIfPresent(userId, (id, emitters) -> {
            emitters.remove(emitter);
            return emitters.isEmpty() ? null : emitters;
        });
    }
}
