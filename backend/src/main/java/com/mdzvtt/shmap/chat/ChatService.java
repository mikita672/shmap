package com.mdzvtt.shmap.chat;

import com.mdzvtt.shmap.chat.dto.ChatMessageResponse;
import com.mdzvtt.shmap.chat.dto.ChatResponse;
import com.mdzvtt.shmap.chat.dto.ChatSummaryResponse;
import com.mdzvtt.shmap.exception.ChatNotFoundException;
import com.mdzvtt.shmap.exception.SelfChatException;
import com.mdzvtt.shmap.exception.UserNotFoundException;
import com.mdzvtt.shmap.storage.StorageService;
import com.mdzvtt.shmap.user.User;
import com.mdzvtt.shmap.user.UserRepository;
import com.mdzvtt.shmap.user.dto.UserSummaryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Limit;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {
    private static final Limit PAGE_SIZE = Limit.of(30);

    private final ChatRepository chatRepository;
    private final ChatMemberRepository chatMemberRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;
    private final StorageService storageService;

    @Transactional
    public ChatResponse openDirect(Integer userId, Integer otherUserId) {
        if (userId.equals(otherUserId)) {
            throw new SelfChatException();
        }

        userRepository.findAllByIdForUpdate(List.of(userId, otherUserId));

        User other = userRepository.findById(otherUserId).orElseThrow(UserNotFoundException::new);

        Chat chat = chatRepository
                .findByDirectUserLowIdAndDirectUserHighId(Math.min(userId, otherUserId),
                        Math.max(userId, otherUserId))
                .orElseGet(() -> createDirect(userRepository.getReferenceById(userId), other));

        return toResponse(chat, userId);
    }

    @Transactional(readOnly = true)
    public List<ChatSummaryResponse> getChats(Integer userId) {
        return chatRepository.findMyChats(userId).stream()
                .map(row -> toSummaryResponse(row, userId))
                .toList();
    }

    @Transactional(readOnly = true)
    public ChatResponse getChat(Integer userId, Long chatId) {
        return toResponse(findChat(userId, chatId), userId);
    }

    @Transactional(readOnly = true)
    public List<ChatMessageResponse> getMessages(Integer userId, Long chatId, Long before) {
        findChat(userId, chatId);
        List<ChatMessage> messages = before == null
                ? chatMessageRepository.findByChatIdOrderByIdDesc(chatId, PAGE_SIZE)
                : chatMessageRepository.findByChatIdAndIdLessThanOrderByIdDesc(chatId, before, PAGE_SIZE);
        return messages.stream()
                .map(this::toMessageResponse)
                .toList();
    }

    @Transactional
    public ChatMessageResponse send(Integer userId, Long chatId, String text) {
        Chat chat = findChat(userId, chatId);
        User sender = userRepository.getReferenceById(userId);
        ChatMessage message = chatMessageRepository.save(new ChatMessage(chat, sender, text));
        return toMessageResponse(message);
    }

    private Chat findChat(Integer userId, Long chatId) {
        return chatRepository.findForMember(chatId, userId).orElseThrow(ChatNotFoundException::new);
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

    private ChatSummaryResponse toSummaryResponse(ChatListRow row, Integer userId) {
        Chat chat = row.chat();
        User otherUser = null;
        if (chat.getType() == ChatType.DIRECT) {
            otherUser = row.directUserLow().getId().equals(userId)
                    ? row.directUserHigh()
                    : row.directUserLow();
        }
        ChatMessage lastMessage = row.lastMessage();
        return new ChatSummaryResponse(
                chat.getId(),
                chat.getType(),
                chat.getName(),
                otherUser == null ? null : toSummary(otherUser),
                lastMessage == null ? null : toMessageResponse(lastMessage, row.lastMessageSender()));
    }

    private ChatMessageResponse toMessageResponse(ChatMessage message) {
        return toMessageResponse(message, message.getSender());
    }

    private ChatMessageResponse toMessageResponse(ChatMessage message, User sender) {
        return new ChatMessageResponse(
                message.getId(),
                toSummary(sender),
                message.getText(),
                message.getCreatedAt());
    }

    private UserSummaryResponse toSummary(User user) {
        return UserSummaryResponse.from(user, storageService.publicUrl(user.getAvatarKey()));
    }
}
