package com.mdzvtt.shmap.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ChangeEmailRequest(
        @NotBlank(message = "Email is required") @Email(message = "Please provide a valid email address") String email) {

    public ChangeEmailRequest {
        email = email == null ? null : email.strip();
    }
}
