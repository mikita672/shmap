package com.mdzvtt.shmap.chat;

import com.mdzvtt.shmap.exception.ChatNotFoundException;
import com.mdzvtt.shmap.friend.FriendshipRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ChatAccess {
    private final ChatRepository chatRepository;
    private final FriendshipRepository friendshipRepository;

    public Chat findForMember(Integer userId, Long chatId) {
        return chatRepository.findForMember(chatId, userId).orElseThrow(ChatNotFoundException::new);
    }

    public void lock(Long chatId) {
        chatRepository.findByIdForUpdate(chatId).orElseThrow(ChatNotFoundException::new);
    }

    public boolean canSend(Chat chat, Integer userId) {
        return chat.getType() == ChatType.GROUP
                || friendshipRepository.existsByUserIdAndFriendId(userId, chat.otherUserId(userId));
    }
}
