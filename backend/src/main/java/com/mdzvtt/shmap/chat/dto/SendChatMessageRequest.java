package com.mdzvtt.shmap.chat.dto;

import com.mdzvtt.shmap.validation.TextOrPlace;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Size;

import java.util.UUID;

@TextOrPlace
public record SendChatMessageRequest(
        @Size(max = 2000, message = "Message must be at most 2000 characters") String text,

        @Valid ChatPlaceRequest place,

        UUID clientId) {

    public SendChatMessageRequest {
        text = text == null || text.isBlank() ? null : text.strip();
    }
}
