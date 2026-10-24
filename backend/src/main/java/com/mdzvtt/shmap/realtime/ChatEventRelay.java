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

    @TransactionalEventListener
    public void onMessageSent(ChatMessageSent event) {
        registry.send(event.recipientIds(), "chat.message", new ChatMessagePayload(event.chatId(), event.message()));
    }

    @TransactionalEventListener
    public void onChatChanged(ChatChanged event) {
        registry.send(event.recipientIds(), "chat.changed", new ChatChangedPayload(event.chatId()));
    }
}
