package com.mdzvtt.shmap.chat.dto;

import com.mdzvtt.shmap.chat.ChatMessage;
import com.mdzvtt.shmap.chat.ChatMessageType;

public record MessageRouteResponse(Long id, String name) {
    public static MessageRouteResponse from(ChatMessage message) {
        if (message.getType() != ChatMessageType.ROUTE) {
            return null;
        }
        Long id = message.getRoute() == null ? null : message.getRoute().getId();
        return new MessageRouteResponse(id, message.getRouteName());
    }
}
