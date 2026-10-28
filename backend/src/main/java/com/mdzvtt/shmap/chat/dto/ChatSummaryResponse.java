package com.mdzvtt.shmap.chat.dto;

import com.mdzvtt.shmap.chat.ChatType;
import com.mdzvtt.shmap.user.dto.UserSummaryResponse;

import java.util.List;

public record ChatSummaryResponse(
                Long id,
                ChatType type,
                String name,
                UserSummaryResponse otherUser,
                ChatMessageResponse lastMessage,
                long unreadCount,
                List<Integer> memberIds) {
}
