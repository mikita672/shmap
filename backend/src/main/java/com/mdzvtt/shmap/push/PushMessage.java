package com.mdzvtt.shmap.push;

import java.util.Map;

public record PushMessage(String token, String title, String body, Map<String, Object> data, String channelId,
                String threadId) {
}
