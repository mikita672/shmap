package com.mdzvtt.shmap.chat.dto;

import com.mdzvtt.shmap.chat.ChatMessageType;
import com.mdzvtt.shmap.user.dto.UserSummaryResponse;

import java.time.Instant;
import java.util.UUID;

public record ChatMessageResponse(Long id, UserSummaryResponse sender, ChatMessageType type, String text,
                ChatPlaceResponse place, Instant createdAt, UUID clientId) {
}
