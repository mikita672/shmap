package com.mdzvtt.shmap.chat;

public record ChatRead(Long chatId, Integer userId, Long lastReadMessageId, long unreadCount, long totalUnreadCount) {
}
