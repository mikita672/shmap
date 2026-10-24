package com.mdzvtt.shmap.realtime.dto;

import com.mdzvtt.shmap.chat.dto.ChatMessageResponse;

public record ChatMessagePayload(Long chatId, ChatMessageResponse message) {
}
