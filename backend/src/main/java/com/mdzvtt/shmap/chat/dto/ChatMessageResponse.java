package com.mdzvtt.shmap.chat.dto;

import com.mdzvtt.shmap.user.dto.UserSummaryResponse;

import java.time.Instant;

public record ChatMessageResponse(Long id, UserSummaryResponse sender, String text, Instant createdAt) {
}
