package com.mdzvtt.shmap.user.dto;

import com.mdzvtt.shmap.user.User;

public record UserSummaryResponse(
        Integer id,
        String username,
        String firstName,
        String lastName,
        String avatarUrl) {

    public static UserSummaryResponse from(User user, String avatarUrl) {
        return new UserSummaryResponse(
                user.getId(),
                user.getPublicUsername(),
                user.getFirstName(),
                user.getLastName(),
                avatarUrl);
    }
}
