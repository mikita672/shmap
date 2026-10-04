package com.mdzvtt.shmap.user.dto;

import com.mdzvtt.shmap.user.User;

public record UsernameResponse(String username) {

    public static UsernameResponse from(User user) {
        return new UsernameResponse(user.getPublicUsername());
    }
}
