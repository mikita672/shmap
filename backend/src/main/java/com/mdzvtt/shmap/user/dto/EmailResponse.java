package com.mdzvtt.shmap.user.dto;

import com.mdzvtt.shmap.user.User;

public record EmailResponse(String email) {

    public static EmailResponse from(User user) {
        return new EmailResponse(user.getEmail());
    }
}
