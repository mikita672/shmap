package com.mdzvtt.shmap.friend;

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
        User receiver = userRepository.findById(receiverId).orElseThrow(UserNotFoundException::new);
        User sender = userRepository.getReferenceById(senderId);

        FriendRequest request = friendRequestRepository.save(new FriendRequest(sender, receiver));

        return SendFriendRequestResponse.requestSent(request.getId());
    }
}
