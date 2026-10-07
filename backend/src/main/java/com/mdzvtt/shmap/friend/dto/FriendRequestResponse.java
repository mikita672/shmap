package com.mdzvtt.shmap.friend.dto;

import com.mdzvtt.shmap.user.dto.UserSummaryResponse;

import java.time.Instant;

public record FriendRequestResponse(Long id, UserSummaryResponse user, Instant createdAt) {
}
