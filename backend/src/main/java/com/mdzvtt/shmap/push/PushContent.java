package com.mdzvtt.shmap.push;

import java.util.Map;

public record PushContent(String title, String body, Map<String, Object> data, String channelId, String threadId) {
}
