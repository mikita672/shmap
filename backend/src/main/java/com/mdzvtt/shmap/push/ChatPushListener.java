package com.mdzvtt.shmap.push;

import com.mdzvtt.shmap.chat.ChatMessageSent;
import com.mdzvtt.shmap.chat.ChatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;

import java.util.HashSet;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class ChatPushListener {
    private final ChatRepository chatRepository;
    private final PushNotifier pushNotifier;

    @Async
    @TransactionalEventListener
    public void onMessageSent(ChatMessageSent event) {
        Set<Integer> recipientIds = new HashSet<>(event.recipientIds());
        recipientIds.remove(event.message().sender().id());
        if (recipientIds.isEmpty()) {
            return;
        }
        chatRepository.findById(event.chatId()).ifPresent(chat -> pushNotifier.notify(recipientIds,
                ChatPushContentFactory.forMessage(chat, event.message())));
    }
}
