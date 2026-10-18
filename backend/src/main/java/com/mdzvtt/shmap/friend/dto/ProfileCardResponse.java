package com.mdzvtt.shmap.friend.dto;

import com.mdzvtt.shmap.user.User;

public record ProfileCardResponse(
        String username,
        String firstName,
        String lastName,
        String avatarUrl) {

    public static ProfileCardResponse from(User user, String avatarUrl) {
        return new ProfileCardResponse(
                user.getPublicUsername(),
                user.getFirstName(),
                user.getLastName(),
                avatarUrl);
    }
}
