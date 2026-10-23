package com.mdzvtt.shmap.chat.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.Set;

public record CreateGroupChatRequest(
        @NotBlank(message = "Group name is required") @Size(max = 50, message = "Group name must be at most 50 characters") String name,

        @NotEmpty(message = "Pick at least one member") @Size(max = 50, message = "At most 50 members at a time") Set<@NotNull(message = "Member id must not be null") Integer> memberIds) {

    public CreateGroupChatRequest {
        name = name == null ? null : name.strip();
    }
}
