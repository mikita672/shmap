package com.mdzvtt.shmap.chat;

import com.mdzvtt.shmap.block.UserBlockRepository;
import com.mdzvtt.shmap.chat.dto.ChatMessageResponse;
import com.mdzvtt.shmap.chat.dto.ChatResponse;
import com.mdzvtt.shmap.chat.dto.ChatSummaryResponse;
import com.mdzvtt.shmap.exception.ChatNotFoundException;
import com.mdzvtt.shmap.exception.GroupWithoutMembersException;
import com.mdzvtt.shmap.exception.NotFriendsException;
import com.mdzvtt.shmap.exception.NotGroupChatException;
import com.mdzvtt.shmap.exception.SelfChatException;
import com.mdzvtt.shmap.exception.UserNotFoundException;
import com.mdzvtt.shmap.friend.FriendshipRepository;
import com.mdzvtt.shmap.storage.StorageService;
import com.mdzvtt.shmap.user.User;
import com.mdzvtt.shmap.user.UserRepository;
import com.mdzvtt.shmap.user.dto.UserSummaryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Limit;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ChatService {
    private static final Limit PAGE_SIZE = Limit.of(30);

    private final ChatRepository chatRepository;
    private final ChatMemberRepository chatMemberRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;
    private final FriendshipRepository friendshipRepository;
    private final UserBlockRepository userBlockRepository;
    private final StorageService storageService;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public ChatResponse openDirect(Integer userId, Integer otherUserId) {
        if (userId.equals(otherUserId)) {
            throw new SelfChatException();
        }

        userRepository.findAllByIdForUpdate(List.of(userId, otherUserId));

        User other = userRepository.findById(otherUserId).orElseThrow(UserNotFoundException::new);

        if (userBlockRepository.existsBetween(userId, otherUserId)) {
            throw new UserNotFoundException();
        }

        Chat chat = chatRepository
                .findByDirectUserLowIdAndDirectUserHighId(Math.min(userId, otherUserId),
                        Math.max(userId, otherUserId))
                .orElseGet(() -> startDirect(userId, other));

        return toResponse(chat, userId);
    }

    @Transactional
    public ChatResponse createGroup(Integer userId, String name, Set<Integer> memberIds) {
        Set<Integer> otherIds = new LinkedHashSet<>(memberIds);
        otherIds.remove(userId);
        if (otherIds.isEmpty()) {
            throw new GroupWithoutMembersException();
        }

        List<User> others = findUsers(otherIds);

        Chat chat = chatRepository.save(Chat.group(name));
        List<ChatMember> members = new ArrayList<>();
        members.add(new ChatMember(chat, userRepository.getReferenceById(userId)));
        for (User other : others) {
            members.add(new ChatMember(chat, other));
        }
        chatMemberRepository.saveAll(members);
        Set<Integer> recipientIds = new LinkedHashSet<>(otherIds);
        recipientIds.add(userId);
        eventPublisher.publishEvent(new ChatChanged(chat.getId(), recipientIds));

        return toResponse(chat, userId);
    }

    @Transactional
    public ChatResponse addMembers(Integer userId, Long chatId, Set<Integer> userIds) {
        lockChat(chatId);
        Chat chat = findGroupChat(userId, chatId);

        Set<Integer> newIds = new LinkedHashSet<>(userIds);
        newIds.removeAll(chatMemberRepository.findUserIdsByChatId(chatId));

        List<ChatMember> newMembers = findUsers(newIds).stream()
                .map(user -> new ChatMember(chat, user))
                .toList();
        chatMemberRepository.saveAll(newMembers);
        eventPublisher.publishEvent(new ChatChanged(chatId, chatMemberRepository.findUserIdsByChatId(chatId)));

        return toResponse(chat, userId);
    }

    @Transactional
    public void leave(Integer userId, Long chatId) {
        lockChat(chatId);
        Chat chat = findGroupChat(userId, chatId);
        chatMemberRepository.deleteByChatIdAndUserId(chatId, userId);

        if (!chatMemberRepository.existsByChatId(chatId)) {
            chatRepository.delete(chat);
        } else {
            eventPublisher.publishEvent(new ChatChanged(chatId, chatMemberRepository.findUserIdsByChatId(chatId)));
        }
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
        if (!canSend(chat, userId)) {
            throw new NotFriendsException("You can only message friends");
        }
        User sender = userRepository.getReferenceById(userId);
        ChatMessage message = chatMessageRepository.save(new ChatMessage(chat, sender, text));
        ChatMessageResponse response = toMessageResponse(message);
        eventPublisher
                .publishEvent(new ChatMessageSent(chatId, chatMemberRepository.findUserIdsByChatId(chatId), response));
        return response;
    }

    private Chat findChat(Integer userId, Long chatId) {
        return chatRepository.findForMember(chatId, userId).orElseThrow(ChatNotFoundException::new);
    }

    private boolean canSend(Chat chat, Integer userId) {
        return chat.getType() == ChatType.GROUP
                || friendshipRepository.existsByUserIdAndFriendId(userId, chat.otherUserId(userId));
    }

    private void lockChat(Long chatId) {
        chatRepository.findByIdForUpdate(chatId).orElseThrow(ChatNotFoundException::new);
    }

    private Chat findGroupChat(Integer userId, Long chatId) {
        Chat chat = findChat(userId, chatId);
        if (chat.getType() != ChatType.GROUP) {
            throw new NotGroupChatException();
        }
        return chat;
    }

    private List<User> findUsers(Set<Integer> ids) {
        List<User> users = userRepository.findAllById(ids);
        if (users.size() != ids.size()) {
            throw new UserNotFoundException();
        }
        return users;
    }

    private Chat startDirect(Integer userId, User other) {
        if (!friendshipRepository.existsByUserIdAndFriendId(userId, other.getId())) {
            throw new NotFriendsException();
        }
        return createDirect(userRepository.getReferenceById(userId), other);
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
        return new ChatResponse(chat.getId(), chat.getType(), chat.getName(), members, canSend(chat, userId));
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
