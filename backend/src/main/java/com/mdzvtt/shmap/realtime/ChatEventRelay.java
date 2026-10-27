package com.mdzvtt.shmap.realtime;

import com.mdzvtt.shmap.chat.ChatChanged;
import com.mdzvtt.shmap.chat.ChatMessageSent;
import com.mdzvtt.shmap.chat.ChatRead;
import com.mdzvtt.shmap.realtime.dto.ChatChangedPayload;
import com.mdzvtt.shmap.realtime.dto.ChatMessagePayload;
import com.mdzvtt.shmap.realtime.dto.ChatReadPayload;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;

import java.util.Set;

@Component
@RequiredArgsConstructor
public class ChatEventRelay {
    private final RedisEventBus bus;

    @TransactionalEventListener
    public void onMessageSent(ChatMessageSent event) {
        bus.publish("chat.message", event.recipientIds(), new ChatMessagePayload(event.chatId(), event.message()));
    }

    @TransactionalEventListener
    public void onChatRead(ChatRead event) {
        bus.publish("chat.read", Set.of(event.userId()), new ChatReadPayload(event.chatId(),
                event.lastReadMessageId(), event.unreadCount(), event.totalUnreadCount()));
    }

    @TransactionalEventListener
    public void onChatChanged(ChatChanged event) {
        bus.publish("chat.changed", event.recipientIds(), new ChatChangedPayload(event.chatId()));
    }
}
