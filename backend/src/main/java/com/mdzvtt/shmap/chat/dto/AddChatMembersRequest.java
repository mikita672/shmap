package com.mdzvtt.shmap.chat.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.Set;

public record AddChatMembersRequest(
                @NotEmpty(message = "Pick at least one person") @Size(max = 50, message = "At most 50 people at a time") Set<@NotNull(message = "User id must not be null") Integer> userIds) {
}
