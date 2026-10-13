package com.mdzvtt.shmap.block;

import com.mdzvtt.shmap.exception.SelfBlockException;
import com.mdzvtt.shmap.exception.UserNotFoundException;
import com.mdzvtt.shmap.friend.FriendRequestRepository;
import com.mdzvtt.shmap.friend.FriendshipRepository;
import com.mdzvtt.shmap.user.User;
import com.mdzvtt.shmap.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BlockService {
    private final UserBlockRepository userBlockRepository;
    private final UserRepository userRepository;
    private final FriendshipRepository friendshipRepository;
    private final FriendRequestRepository friendRequestRepository;

    @Transactional
    public void block(Integer blockerId, Integer blockedId) {
        if (blockerId.equals(blockedId)) {
            throw new SelfBlockException();
        }

        User blocked = userRepository.findById(blockedId).orElseThrow(UserNotFoundException::new);

        if (userBlockRepository.existsByBlockerIdAndBlockedId(blockerId, blockedId)) {
            return;
        }

        friendshipRepository.deleteBetween(blockerId, blockedId);
        friendRequestRepository.deleteBySenderIdAndReceiverId(blockerId, blockedId);
        friendRequestRepository.deleteBySenderIdAndReceiverId(blockedId, blockerId);

        User blocker = userRepository.getReferenceById(blockerId);
        userBlockRepository.save(new UserBlock(blocker, blocked));
    }
}
