package com.mdzvtt.shmap.user.dto;

import com.mdzvtt.shmap.user.User;

public record AccountResponse(String username, String email) {

    public static AccountResponse from(User user) {
        return new AccountResponse(user.getPublicUsername(), user.getEmail());
    }
}
