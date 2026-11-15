package com.mdzvtt.shmap.suggestion;

import com.mdzvtt.shmap.exception.SuggestionLimitException;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;

@Component
@RequiredArgsConstructor
@EnableConfigurationProperties(SuggestionLimits.class)
public class SuggestionLimiter {
    private static final String PREFIX = "ai:suggestions:";
    private static final Duration KEY_LIFETIME = Duration.ofDays(2);

    private final StringRedisTemplate redis;
    private final SuggestionLimits limits;

    public void count(Integer userId) {
        LocalDate today = LocalDate.now(ZoneOffset.UTC);
        String userKey = PREFIX + "user:" + userId + ":" + today;
        if (increment(userKey) > limits.perUserDaily()) {
            throw SuggestionLimitException.forUser(limits.perUserDaily(), secondsUntilTomorrow(today));
        }
        if (increment(PREFIX + "all:" + today) > limits.globalDaily()) {
            redis.opsForValue().decrement(userKey);
            throw SuggestionLimitException.forEveryone(secondsUntilTomorrow(today));
        }
    }

    private long increment(String key) {
        Long value = redis.opsForValue().increment(key);
        if (value != null && value == 1) {
            redis.expire(key, KEY_LIFETIME);
        }
        return value == null ? 0 : value;
    }

    private static long secondsUntilTomorrow(LocalDate today) {
        Instant midnight = today.plusDays(1).atStartOfDay(ZoneOffset.UTC).toInstant();
        return Math.max(1, Duration.between(Instant.now(), midnight).toSeconds());
    }
}
