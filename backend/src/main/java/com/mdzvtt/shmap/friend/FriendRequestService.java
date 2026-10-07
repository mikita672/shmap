package com.mdzvtt.shmap.friend;

import com.mdzvtt.shmap.exception.DuplicateFriendRequestException;
import com.mdzvtt.shmap.exception.SelfFriendRequestException;
import com.mdzvtt.shmap.exception.UserNotFoundException;
import com.mdzvtt.shmap.friend.dto.FriendRequestResponse;
import com.mdzvtt.shmap.friend.dto.SendFriendRequestResponse;
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
public class FriendRequestService {
    private final FriendRequestRepository friendRequestRepository;
    private final UserRepository userRepository;
    private final StorageService storageService;

    @Transactional
    public SendFriendRequestResponse send(Integer senderId, Integer receiverId) {
        if (senderId.equals(receiverId)) {
            throw new SelfFriendRequestException();
        }

        User receiver = userRepository.findById(receiverId).orElseThrow(UserNotFoundException::new);

        if (friendRequestRepository.existsBySenderIdAndReceiverId(senderId, receiverId)) {
            throw new DuplicateFriendRequestException();
        }

        User sender = userRepository.getReferenceById(senderId);

        FriendRequest request = friendRequestRepository.save(new FriendRequest(sender, receiver));

        return SendFriendRequestResponse.requestSent(request.getId());
    }

    @Transactional(readOnly = true)
    public List<FriendRequestResponse> getIncoming(Integer userId) {
        return friendRequestRepository.findByReceiverIdOrderByCreatedAtDesc(userId).stream()
                .map(request -> toResponse(request, request.getSender()))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<FriendRequestResponse> getSent(Integer userId) {
        return friendRequestRepository.findBySenderIdOrderByCreatedAtDesc(userId).stream()
                .map(request -> toResponse(request, request.getReceiver()))
                .toList();
    }

    private FriendRequestResponse toResponse(FriendRequest request, User otherUser) {
        String avatarUrl = storageService.publicUrl(otherUser.getAvatarKey());
        return new FriendRequestResponse(
                request.getId(),
                UserSummaryResponse.from(otherUser, avatarUrl),
                request.getCreatedAt());
    }
}
