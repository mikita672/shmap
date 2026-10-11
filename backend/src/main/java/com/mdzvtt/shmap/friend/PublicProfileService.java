package com.mdzvtt.shmap.friend;

import com.mdzvtt.shmap.block.UserBlockRepository;
import com.mdzvtt.shmap.exception.UserNotFoundException;
import com.mdzvtt.shmap.friend.dto.PublicProfileResponse;
import com.mdzvtt.shmap.storage.StorageService;
import com.mdzvtt.shmap.user.User;
import com.mdzvtt.shmap.user.UserRepository;
import com.mdzvtt.shmap.user.dto.UserSummaryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PublicProfileService {
    private final UserRepository userRepository;
    private final UserBlockRepository userBlockRepository;
    private final FriendshipRepository friendshipRepository;
    private final FriendRequestRepository friendRequestRepository;
    private final StorageService storageService;

    @Transactional(readOnly = true)
    public PublicProfileResponse getProfile(Integer viewerId, String username) {
        User user = userRepository.findByUsername(username).orElseThrow(UserNotFoundException::new);

        if (userBlockRepository.existsBetween(viewerId, user.getId())) {
            throw new UserNotFoundException();
        }

        Optional<Friendship> friendship = friendshipRepository.findByUserIdAndFriendId(viewerId, user.getId());
        FriendRequestIds request = friendRequestRepository.findIdsBetween(viewerId, List.of(user.getId())).stream()
                .findFirst()
                .orElse(null);
        Relationship relationship = Relationship.of(viewerId, friendship.isPresent(), request);
        Long requestId = request == null ? null : request.id();

        String avatarUrl = storageService.publicUrl(user.getAvatarKey());
        return new PublicProfileResponse(UserSummaryResponse.from(user, avatarUrl), user.getBio(), relationship,
                requestId);
    }
}
