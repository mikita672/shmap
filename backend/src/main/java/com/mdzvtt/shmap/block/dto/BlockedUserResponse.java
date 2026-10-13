package com.mdzvtt.shmap.block.dto;

import com.mdzvtt.shmap.user.dto.UserSummaryResponse;

import java.time.Instant;

public record BlockedUserResponse(UserSummaryResponse user, Instant blockedAt) {
}
