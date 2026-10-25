package com.mdzvtt.shmap.realtime;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
class RedisSubscriptionStarter {
    private final RedisMessageListenerContainer container;

    @Scheduled(fixedDelay = 5000)
    void ensureSubscribed() {
        if (container.isRunning()) {
            return;
        }
        try {
            container.start();
            log.info("Subscribed to Redis");
        } catch (RuntimeException e) {
            container.stop();
            log.warn("Redis is not reachable, will try to subscribe again: {}", e.getMessage());
        }
    }
}
