package com.mdzvtt.shmap.user.dto;

import com.mdzvtt.shmap.user.User;

import java.time.Instant;

public record ProfileResponse(
        Integer id,
        String firstName,
        String lastName,
        String username,
        String email,
        String bio,
        String avatarUrl,
        Instant createdAt) {

    public static ProfileResponse from(User user, String avatarUrl) {
        return new ProfileResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getPublicUsername(),
                user.getEmail(),
                user.getBio(),
                avatarUrl,
                user.getCreatedAt());
    }
}
