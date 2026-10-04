package com.mdzvtt.shmap.user.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
        @Pattern(regexp = ".*\\S.*", message = "First name is required") @Size(max = 50, message = "First name must be at most 50 characters") String firstName,

        @Pattern(regexp = ".*\\S.*", message = "Last name is required") @Size(max = 50, message = "Last name must be at most 50 characters") String lastName,

        @Size(min = 3, max = 30, message = "Username must be between 3 and 30 characters") @Pattern(regexp = "^[a-zA-Z0-9_.-]+$", message = "Username can only contain letters, numbers, underscores, dots, or hyphens") String username,

        @Size(max = 160, message = "Bio must be at most 160 characters") String bio) {

    public UpdateProfileRequest {
        firstName = strip(firstName);
        lastName = strip(lastName);
        username = strip(username);
        bio = strip(bio);
    }

    private static String strip(String value) {
        return value == null ? null : value.strip();
    }
}
