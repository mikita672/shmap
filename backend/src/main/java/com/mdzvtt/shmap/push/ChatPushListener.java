package com.mdzvtt.shmap.push;

import com.mdzvtt.shmap.chat.ChatMembersAdded;
import com.mdzvtt.shmap.chat.ChatMessageSent;
import com.mdzvtt.shmap.chat.ChatRepository;
import com.mdzvtt.shmap.user.UserRepository;
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
    private final UserRepository userRepository;
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

    @Async
    @TransactionalEventListener
    public void onMembersAdded(ChatMembersAdded event) {
        chatRepository.findById(event.chatId()).ifPresent(chat -> userRepository.findById(event.addedById())
                .ifPresent(adder -> pushNotifier.notify(event.addedUserIds(),
                        ChatPushContentFactory.forAddedToGroup(chat, adder.getFirstName(),
                                adder.getPublicUsername()))));
    }
}
