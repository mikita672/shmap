package com.mdzvtt.shmap.friend.dto;

import com.mdzvtt.shmap.user.dto.UserSummaryResponse;

import java.time.Instant;

public record FriendResponse(UserSummaryResponse user, boolean favorite, Instant friendsSince) {
}
