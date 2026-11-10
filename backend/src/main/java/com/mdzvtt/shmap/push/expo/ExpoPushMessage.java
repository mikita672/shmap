package com.mdzvtt.shmap.push.expo;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ExpoPushMessage(String to, String title, String body, Map<String, Object> data, String sound,
                String priority, String channelId, String threadId) {
}
