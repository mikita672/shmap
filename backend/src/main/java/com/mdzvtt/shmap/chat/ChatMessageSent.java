package com.mdzvtt.shmap.chat;

import com.mdzvtt.shmap.chat.dto.ChatMessageResponse;

import java.util.Set;

public record ChatMessageSent(Long chatId, Set<Integer> recipientIds, ChatMessageResponse message) {
}
