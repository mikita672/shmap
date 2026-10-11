package com.mdzvtt.shmap.friend.dto;

import com.mdzvtt.shmap.friend.Relationship;
import com.mdzvtt.shmap.user.dto.UserSummaryResponse;

import java.time.Instant;

public record PublicProfileResponse(
        UserSummaryResponse user,
        String bio,
        Relationship relationship,
        Long requestId,
        boolean favorite,
        Instant friendsSince,
        long mutualFriendsCount,
        Long friendsCount) {
}
