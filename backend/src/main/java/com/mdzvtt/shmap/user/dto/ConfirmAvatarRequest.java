package com.mdzvtt.shmap.user.dto;

import jakarta.validation.constraints.NotBlank;

public record ConfirmAvatarRequest(@NotBlank(message = "Key is required") String key) {
}
