package com.mdzvtt.shmap.push.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterPushTokenRequest(
        @NotBlank(message = "Push token is required") @Size(max = 255, message = "Push token must be at most 255 characters") @Pattern(regexp = "^Expo(nent)?PushToken\\[[^\\]]+]$", message = "Push token must be an Expo push token") String token) {

    public RegisterPushTokenRequest {
        token = token == null ? null : token.strip();
    }
}
