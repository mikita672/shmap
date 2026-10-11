package com.mdzvtt.shmap.friend.dto;

import jakarta.validation.constraints.NotNull;

public record SendFriendRequestRequest(@NotNull(message = "Receiver id is required") Integer receiverId) {
}
