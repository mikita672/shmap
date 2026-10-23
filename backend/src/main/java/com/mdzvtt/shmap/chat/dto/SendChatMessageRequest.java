package com.mdzvtt.shmap.chat.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SendChatMessageRequest(
        @NotBlank(message = "Message text is required") @Size(max = 2000, message = "Message must be at most 2000 characters") String text) {

    public SendChatMessageRequest {
        text = text == null ? null : text.strip();
    }
}
