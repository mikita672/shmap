package com.mdzvtt.shmap.chat.dto;

import com.mdzvtt.shmap.chat.ChatType;
import com.mdzvtt.shmap.user.dto.UserSummaryResponse;

import java.util.List;

public record ChatResponse(Long id, ChatType type, String name, List<UserSummaryResponse> members) {
}
