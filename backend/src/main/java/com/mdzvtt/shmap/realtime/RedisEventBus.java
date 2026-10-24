package com.mdzvtt.shmap.realtime;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;
import tools.jackson.databind.json.JsonMapper;

import java.util.Set;

@Slf4j
@Component
@RequiredArgsConstructor
public class RedisEventBus {
    private final StringRedisTemplate redisTemplate;
    private final JsonMapper jsonMapper;
    private final RealtimeProperties properties;

    public void publish(String type, Set<Integer> userIds, Object data) {
        try {
            BusMessage message = new BusMessage(type, userIds, jsonMapper.valueToTree(data));
            redisTemplate.convertAndSend(properties.channel(), jsonMapper.writeValueAsString(message));
        } catch (RuntimeException e) {
            log.warn("Could not publish {} to Redis", type, e);
        }
    }
}
