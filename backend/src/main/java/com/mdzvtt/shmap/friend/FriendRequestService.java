package com.mdzvtt.shmap.friend;

import com.mdzvtt.shmap.block.UserBlockRepository;
import com.mdzvtt.shmap.exception.AlreadyFriendsException;
import com.mdzvtt.shmap.exception.DuplicateFriendRequestException;
import com.mdzvtt.shmap.exception.FriendRequestNotFoundException;
import com.mdzvtt.shmap.exception.SelfFriendRequestException;
import com.mdzvtt.shmap.exception.UserNotFoundException;
import com.mdzvtt.shmap.friend.dto.FriendRequestCountResponse;
import com.mdzvtt.shmap.friend.dto.FriendRequestResponse;
import com.mdzvtt.shmap.friend.dto.SendFriendRequestResponse;
import com.mdzvtt.shmap.storage.StorageService;
import com.mdzvtt.shmap.user.User;
import com.mdzvtt.shmap.user.UserRepository;
import com.mdzvtt.shmap.user.dto.UserSummaryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FriendRequestService {
    private final FriendRequestRepository friendRequestRepository;
    private final FriendshipRepository friendshipRepository;
    private final FriendActivityRepository friendActivityRepository;
    private final UserBlockRepository userBlockRepository;
    private final UserRepository userRepository;
    private final StorageService storageService;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public SendFriendRequestResponse send(Integer senderId, Integer receiverId) {
        if (senderId.equals(receiverId)) {
            throw new SelfFriendRequestException();
        }

        userRepository.findAllByIdForUpdate(List.of(senderId, receiverId));

        User receiver = userRepository.findById(receiverId).orElseThrow(UserNotFoundException::new);

        if (userBlockRepository.existsBetween(senderId, receiverId)) {
            throw new UserNotFoundException();
        }

        if (friendshipRepository.existsByUserIdAndFriendId(senderId, receiverId)) {
            throw new AlreadyFriendsException();
        }

        if (friendRequestRepository.existsBySenderIdAndReceiverId(senderId, receiverId)) {
            throw new DuplicateFriendRequestException();
        }

        User sender = userRepository.getReferenceById(senderId);

        if (friendRequestRepository.existsBySenderIdAndReceiverId(receiverId, senderId)) {
            becomeFriends(receiver, sender);
            return SendFriendRequestResponse.becameFriends();
        }

        FriendRequest request = friendRequestRepository.save(new FriendRequest(sender, receiver));

        return SendFriendRequestResponse.requestSent(request.getId());
    }

    @Transactional(readOnly = true)
    public List<FriendRequestResponse> getIncoming(Integer userId) {
        return toResponses(userId, friendRequestRepository.findByReceiverIdOrderByCreatedAtDesc(userId),
                request -> request.getSender());
    }

    @Transactional(readOnly = true)
    public List<FriendRequestResponse> getSent(Integer userId) {
        return toResponses(userId, friendRequestRepository.findBySenderIdOrderByCreatedAtDesc(userId),
                request -> request.getReceiver());
    }

    @Transactional(readOnly = true)
    public FriendRequestCountResponse countIncoming(Integer userId) {
        return new FriendRequestCountResponse(friendRequestRepository.countByReceiverId(userId));
    }

    @Transactional
    public void cancel(Integer userId, Long requestId) {
        FriendRequest request = friendRequestRepository.findByIdAndSenderId(requestId, userId)
                .orElseThrow(FriendRequestNotFoundException::new);

        friendRequestRepository.delete(request);
    }

    @Transactional
    public void decline(Integer userId, Long requestId) {
        friendRequestRepository.delete(findIncomingRequest(userId, requestId));
    }

    @Transactional
    public void accept(Integer userId, Long requestId) {
        Integer senderId = findIncomingRequest(userId, requestId).getSender().getId();
        userRepository.findAllByIdForUpdate(List.of(senderId, userId));

        FriendRequest request = findIncomingRequest(userId, requestId);
        becomeFriends(request.getSender(), request.getReceiver());
    }

    private void becomeFriends(User requester, User accepter) {
        friendRequestRepository.deleteBySenderIdAndReceiverId(requester.getId(), accepter.getId());
        friendRequestRepository.deleteBySenderIdAndReceiverId(accepter.getId(), requester.getId());
        friendshipRepository.saveAll(List.of(
                new Friendship(requester, accepter),
                new Friendship(accepter, requester)));
        friendActivityRepository.saveAll(List.of(
                new FriendActivity(requester, accepter, FriendActivityType.REQUEST_ACCEPTED),
                new FriendActivity(accepter, requester, FriendActivityType.NEW_FRIENDSHIP)));
        eventPublisher.publishEvent(new FriendshipStarted(requester.getId(), accepter.getId()));
    }

    private FriendRequest findIncomingRequest(Integer userId, Long requestId) {
        return friendRequestRepository.findByIdAndReceiverId(requestId, userId)
                .orElseThrow(FriendRequestNotFoundException::new);
    }

    private List<FriendRequestResponse> toResponses(Integer userId, List<FriendRequest> requests,
            Function<FriendRequest, User> otherUser) {
        if (requests.isEmpty()) {
            return List.of();
        }

        List<Integer> otherUserIds = requests.stream().map(request -> otherUser.apply(request).getId()).toList();
        Map<Integer, Long> mutualFriendsCounts = friendshipRepository
                .countMutualFriends(userId, otherUserIds).stream()
                .collect(Collectors.toMap(mutual -> mutual.userId(), mutual -> mutual.count()));

        return requests.stream()
                .map(request -> {
                    User other = otherUser.apply(request);
                    return toResponse(request, other, mutualFriendsCounts.getOrDefault(other.getId(), 0L));
                })
                .toList();
    }

    private FriendRequestResponse toResponse(FriendRequest request, User otherUser, long mutualFriendsCount) {
        String avatarUrl = storageService.publicUrl(otherUser.getAvatarKey());
        return new FriendRequestResponse(
                request.getId(),
                UserSummaryResponse.from(otherUser, avatarUrl),
                request.getCreatedAt(),
                mutualFriendsCount);
    }
}
