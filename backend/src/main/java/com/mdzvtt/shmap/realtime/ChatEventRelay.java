package com.mdzvtt.shmap.realtime;

import com.mdzvtt.shmap.chat.ChatChanged;
import com.mdzvtt.shmap.chat.ChatMessageSent;
import com.mdzvtt.shmap.realtime.dto.ChatChangedPayload;
import com.mdzvtt.shmap.realtime.dto.ChatMessagePayload;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public class ChatEventRelay {
    private final EventStreamRegistry registry;
    private final RedisEventBus bus;

    @TransactionalEventListener
    public void onMessageSent(ChatMessageSent event) {
        ChatMessagePayload payload = new ChatMessagePayload(event.chatId(), event.message());
        registry.send(event.recipientIds(), "chat.message", payload);
        bus.publish("chat.message", event.recipientIds(), payload);
    }

    @TransactionalEventListener
    public void onChatChanged(ChatChanged event) {
        ChatChangedPayload payload = new ChatChangedPayload(event.chatId());
        registry.send(event.recipientIds(), "chat.changed", payload);
        bus.publish("chat.changed", event.recipientIds(), payload);
    }
}
