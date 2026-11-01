package com.mdzvtt.shmap.chat.dto;

import jakarta.validation.constraints.NotNull;

public record MarkChatReadRequest(@NotNull(message = "Message id is required") Long messageId) {
}
