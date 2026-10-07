package com.mdzvtt.shmap.friend;

import com.mdzvtt.shmap.exception.DuplicateFriendRequestException;
import com.mdzvtt.shmap.exception.SelfFriendRequestException;
import com.mdzvtt.shmap.exception.UserNotFoundException;
import com.mdzvtt.shmap.friend.dto.SendFriendRequestResponse;
import com.mdzvtt.shmap.user.User;
import com.mdzvtt.shmap.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FriendRequestService {
    private final FriendRequestRepository friendRequestRepository;
    private final UserRepository userRepository;

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
}
