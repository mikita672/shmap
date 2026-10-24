package com.mdzvtt.shmap.realtime;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.stereotype.Component;
import tools.jackson.databind.json.JsonMapper;

import java.nio.charset.StandardCharsets;

@Slf4j
@Component
@RequiredArgsConstructor
public class RedisEventSubscriber implements MessageListener {
    private final EventStreamRegistry registry;
    private final JsonMapper jsonMapper;

    @Override
    public void onMessage(Message message, byte[] pattern) {
        try {
            BusMessage busMessage = jsonMapper.readValue(
                    new String(message.getBody(), StandardCharsets.UTF_8), BusMessage.class);
            registry.send(busMessage.userIds(), busMessage.type(), busMessage.data());
        } catch (RuntimeException e) {
            log.warn("Could not handle a message from Redis", e);
        }
    }
}
