package com.mdzvtt.shmap.chat;

import com.mdzvtt.shmap.friend.FriendshipEnded;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
@RequiredArgsConstructor
public class FriendshipListener {
    private final ChatRepository chatRepository;
    private final ApplicationEventPublisher eventPublisher;

    @EventListener
    public void onFriendshipEnded(FriendshipEnded event) {
        announceDirectChat(event.userId(), event.otherUserId());
    }

    private void announceDirectChat(Integer userId, Integer otherUserId) {
        chatRepository
                .findByDirectUserLowIdAndDirectUserHighId(Math.min(userId, otherUserId), Math.max(userId, otherUserId))
                .ifPresent(chat -> eventPublisher
                        .publishEvent(new ChatChanged(chat.getId(), Set.of(userId, otherUserId))));
    }
}
