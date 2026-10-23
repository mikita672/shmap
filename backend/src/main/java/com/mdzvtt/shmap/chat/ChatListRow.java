package com.mdzvtt.shmap.chat;

import com.mdzvtt.shmap.user.User;

public record ChatListRow(
                Chat chat,
                User directUserLow,
                User directUserHigh,
                ChatMessage lastMessage,
                User lastMessageSender) {
}
