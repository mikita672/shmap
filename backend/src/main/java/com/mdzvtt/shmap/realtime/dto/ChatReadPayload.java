package com.mdzvtt.shmap.realtime.dto;

public record ChatReadPayload(Long chatId, Long lastReadMessageId, long unreadCount, long totalUnreadCount) {
}
