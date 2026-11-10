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
        UserSummaryResponse sender = message.sender();
        String content = describe(message);
        return new PushContent(
                group ? chat.getName() : PushNames.fullName(sender.firstName(), sender.lastName(), sender.username()),
                truncate(group ? PushNames.firstName(sender.firstName(), sender.username()) + ": " + content : content),
                Map.of("type", "chat.message", "chatId", chat.getId(), "messageId", message.id()),
                CHANNEL,
                "chat-" + chat.getId());
    }

    static PushContent forAddedToGroup(Chat chat, String adderFirstName, String adderUsername) {
        return new PushContent(
                chat.getName(),
                PushNames.firstName(adderFirstName, adderUsername) + " added you to the group",
                Map.of("type", "chat.added", "chatId", chat.getId()),
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

    private static String truncate(String text) {
        if (text.codePointCount(0, text.length()) <= MAX_BODY_LENGTH) {
            return text;
        }
        return text.substring(0, text.offsetByCodePoints(0, MAX_BODY_LENGTH - 1)) + "…";
    }
}
