package com.mdzvtt.shmap.block;

import com.mdzvtt.shmap.block.dto.BlockedUserResponse;
import com.mdzvtt.shmap.exception.BlockNotFoundException;
import com.mdzvtt.shmap.exception.SelfBlockException;
import com.mdzvtt.shmap.exception.UserNotFoundException;
import com.mdzvtt.shmap.friend.FriendActivityRepository;
import com.mdzvtt.shmap.friend.FriendRequestRepository;
import com.mdzvtt.shmap.friend.FriendshipEnded;
import com.mdzvtt.shmap.friend.FriendshipRepository;
import com.mdzvtt.shmap.storage.StorageService;
import com.mdzvtt.shmap.user.User;
import com.mdzvtt.shmap.user.UserRepository;
import com.mdzvtt.shmap.user.dto.UserSummaryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BlockService {
    private final UserBlockRepository userBlockRepository;
    private final UserRepository userRepository;
    private final FriendshipRepository friendshipRepository;
    private final FriendActivityRepository friendActivityRepository;
    private final FriendRequestRepository friendRequestRepository;
    private final StorageService storageService;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public void block(Integer blockerId, Integer blockedId) {
        if (blockerId.equals(blockedId)) {
            throw new SelfBlockException();
        }

        userRepository.findAllByIdForUpdate(List.of(blockerId, blockedId));

        User blocked = userRepository.findById(blockedId).orElseThrow(UserNotFoundException::new);

        if (userBlockRepository.existsByBlockerIdAndBlockedId(blockerId, blockedId)) {
            return;
        }

        if (friendshipRepository.deleteBetween(blockerId, blockedId) > 0) {
            eventPublisher.publishEvent(new FriendshipEnded(blockerId, blockedId));
        }
        friendActivityRepository.deleteBetween(blockerId, blockedId);
        friendRequestRepository.deleteBySenderIdAndReceiverId(blockerId, blockedId);
        friendRequestRepository.deleteBySenderIdAndReceiverId(blockedId, blockerId);

        User blocker = userRepository.getReferenceById(blockerId);
        userBlockRepository.save(new UserBlock(blocker, blocked));
    }

    @Transactional(readOnly = true)
    public List<BlockedUserResponse> getBlocked(Integer userId) {
        return userBlockRepository.findByBlockerIdOrderByCreatedAtDesc(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public void unblock(Integer blockerId, Integer blockedId) {
        if (userBlockRepository.deleteByBlockerIdAndBlockedId(blockerId, blockedId) == 0) {
            throw new BlockNotFoundException();
        }
    }

    private BlockedUserResponse toResponse(UserBlock block) {
        User blocked = block.getBlocked();
        String avatarUrl = storageService.publicUrl(blocked.getAvatarKey());
        return new BlockedUserResponse(UserSummaryResponse.from(blocked, avatarUrl), block.getCreatedAt());
    }
}
