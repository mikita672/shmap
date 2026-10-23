package com.mdzvtt.shmap.chat.dto;

import com.mdzvtt.shmap.chat.ChatType;
import com.mdzvtt.shmap.user.dto.UserSummaryResponse;

public record ChatSummaryResponse(
                Long id,
                ChatType type,
                String name,
                UserSummaryResponse otherUser,
                ChatMessageResponse lastMessage) {
}
