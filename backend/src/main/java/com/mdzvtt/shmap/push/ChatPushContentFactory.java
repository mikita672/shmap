package com.mdzvtt.shmap.push;

import com.mdzvtt.shmap.chat.Chat;
import com.mdzvtt.shmap.chat.ChatType;
import com.mdzvtt.shmap.chat.dto.ChatMessageResponse;
import com.mdzvtt.shmap.user.dto.UserSummaryResponse;

import java.util.Map;

final class ChatPushContentFactory {
    private static final String CHANNEL = "messages";
    private static final int MAX_BODY_LENGTH = 180;

    private ChatPushContentFactory() {
    }

    static PushContent forMessage(Chat chat, ChatMessageResponse message) {
        boolean group = chat.getType() == ChatType.GROUP;
        String content = describe(message);
        return new PushContent(
                group ? chat.getName() : fullName(message.sender()),
                truncate(group ? firstName(message.sender()) + ": " + content : content),
                Map.of("type", "chat.message", "chatId", chat.getId(), "messageId", message.id()),
                CHANNEL,
                "chat-" + chat.getId());
    }

    private static String describe(ChatMessageResponse message) {
        return switch (message.type()) {
            case TEXT -> message.text();
            case PLACE -> "📍 " + message.place().name();
            case ROUTE -> message.text() != null ? message.text() : "🗺️ " + message.route().name();
        };
    }

    private static String fullName(UserSummaryResponse user) {
        String name = ((user.firstName() == null ? "" : user.firstName()) + " "
                + (user.lastName() == null ? "" : user.lastName())).strip();
        return name.isEmpty() ? "@" + user.username() : name;
    }

    private static String firstName(UserSummaryResponse user) {
        return user.firstName() == null || user.firstName().isBlank() ? "@" + user.username() : user.firstName();
    }

    private static String truncate(String text) {
        if (text.codePointCount(0, text.length()) <= MAX_BODY_LENGTH) {
            return text;
        }
        return text.substring(0, text.offsetByCodePoints(0, MAX_BODY_LENGTH - 1)) + "…";
    }
}
