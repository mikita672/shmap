package com.mdzvtt.shmap.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record AvatarUploadRequest(
                @NotBlank(message = "Content type is required") String contentType,

                @NotNull(message = "Content length is required") @Positive(message = "Content length must be positive") Long contentLength) {
}
