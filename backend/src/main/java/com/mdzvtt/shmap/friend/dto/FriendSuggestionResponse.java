package com.mdzvtt.shmap.friend.dto;

import com.mdzvtt.shmap.user.dto.UserSummaryResponse;

public record FriendSuggestionResponse(UserSummaryResponse user, long mutualFriendsCount) {
}
