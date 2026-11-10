package com.mdzvtt.shmap.push;

import com.mdzvtt.shmap.chat.ChatMessageSent;
import com.mdzvtt.shmap.chat.ChatRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Slf4j
@Component
@RequiredArgsConstructor
public class ChatPushListener {
    private final PushTokenRepository pushTokenRepository;
    private final ChatRepository chatRepository;

    @Async
    @TransactionalEventListener
    public void onMessageSent(ChatMessageSent event) {
        Set<Integer> recipientIds = new HashSet<>(event.recipientIds());
        recipientIds.remove(event.message().sender().id());
        if (recipientIds.isEmpty()) {
            return;
        }
        List<String> tokens = pushTokenRepository.findTokensByUserIdIn(recipientIds);
        if (tokens.isEmpty()) {
            return;
        }
        chatRepository.findById(event.chatId()).ifPresent(chat -> {
            PushContent content = ChatPushContentFactory.forMessage(chat, event.message());
            log.info("Push for message {} to {} token(s): {}", event.message().id(), tokens.size(), content);
        });
    }
}
