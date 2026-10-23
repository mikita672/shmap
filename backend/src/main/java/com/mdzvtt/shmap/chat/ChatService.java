package com.mdzvtt.shmap.chat;

import com.mdzvtt.shmap.chat.dto.ChatResponse;
import com.mdzvtt.shmap.exception.SelfChatException;
import com.mdzvtt.shmap.exception.UserNotFoundException;
import com.mdzvtt.shmap.storage.StorageService;
import com.mdzvtt.shmap.user.User;
import com.mdzvtt.shmap.user.UserRepository;
import com.mdzvtt.shmap.user.dto.UserSummaryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {
    private final ChatRepository chatRepository;
    private final ChatMemberRepository chatMemberRepository;
    private final UserRepository userRepository;
    private final StorageService storageService;

    @Transactional
    public ChatResponse openDirect(Integer userId, Integer otherUserId) {
        if (userId.equals(otherUserId)) {
            throw new SelfChatException();
        }

        User other = userRepository.findById(otherUserId).orElseThrow(UserNotFoundException::new);

        Chat chat = chatRepository
                .findByDirectUserLowIdAndDirectUserHighId(Math.min(userId, otherUserId),
                        Math.max(userId, otherUserId))
                .orElseGet(() -> createDirect(userRepository.getReferenceById(userId), other));

        return toResponse(chat, userId);
    }

    private Chat createDirect(User user, User other) {
        Chat chat = chatRepository.save(Chat.direct(user, other));
        chatMemberRepository.saveAll(List.of(
                new ChatMember(chat, user),
                new ChatMember(chat, other)));
        return chat;
    }

    private ChatResponse toResponse(Chat chat, Integer userId) {
        List<UserSummaryResponse> members = chatMemberRepository.findOtherMembers(chat.getId(), userId).stream()
                .map(this::toSummary)
                .toList();
        return new ChatResponse(chat.getId(), chat.getType(), chat.getName(), members);
    }

    private UserSummaryResponse toSummary(User user) {
        return UserSummaryResponse.from(user, storageService.publicUrl(user.getAvatarKey()));
    }
}
