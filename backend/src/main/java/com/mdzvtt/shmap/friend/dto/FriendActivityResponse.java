package com.mdzvtt.shmap.friend.dto;

import com.mdzvtt.shmap.friend.FriendActivityType;
import com.mdzvtt.shmap.user.dto.UserSummaryResponse;

import java.time.Instant;

public record FriendActivityResponse(Long id, FriendActivityType type, UserSummaryResponse user, Instant createdAt) {
}
