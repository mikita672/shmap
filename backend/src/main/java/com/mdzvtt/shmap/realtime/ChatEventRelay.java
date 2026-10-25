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
    private final RedisEventBus bus;

    @TransactionalEventListener
    public void onMessageSent(ChatMessageSent event) {
        bus.publish("chat.message", event.recipientIds(), new ChatMessagePayload(event.chatId(), event.message()));
    }

    @TransactionalEventListener
    public void onChatChanged(ChatChanged event) {
        bus.publish("chat.changed", event.recipientIds(), new ChatChangedPayload(event.chatId()));
    }
}
