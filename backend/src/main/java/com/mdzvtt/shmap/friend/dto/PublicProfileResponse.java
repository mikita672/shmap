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
                boolean muted,
                Instant friendsSince,
                long mutualFriendsCount,
                boolean previewOnly,
                Long friendsCount,
                boolean friendsListVisible) {
}
