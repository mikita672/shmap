package com.mdzvtt.shmap.friend;

import com.mdzvtt.shmap.exception.FriendNotFoundException;
import com.mdzvtt.shmap.friend.dto.FriendResponse;
import com.mdzvtt.shmap.storage.StorageService;
import com.mdzvtt.shmap.user.User;
import com.mdzvtt.shmap.user.dto.UserSummaryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FriendService {
    private final FriendshipRepository friendshipRepository;
    private final StorageService storageService;

    @Transactional(readOnly = true)
    public List<FriendResponse> getFriends(Integer userId) {
        return friendshipRepository.findFriends(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public void remove(Integer userId, Integer friendId) {
        if (friendshipRepository.deleteBetween(userId, friendId) == 0) {
            throw new FriendNotFoundException();
        }
    }

    @Transactional
    public void addFavorite(Integer userId, Integer friendId) {
        findFriendship(userId, friendId).markFavorite();
    }

    @Transactional
    public void removeFavorite(Integer userId, Integer friendId) {
        findFriendship(userId, friendId).unmarkFavorite();
    }

    private Friendship findFriendship(Integer userId, Integer friendId) {
        return friendshipRepository.findByUserIdAndFriendId(userId, friendId)
                .orElseThrow(FriendNotFoundException::new);
    }

    private FriendResponse toResponse(Friendship friendship) {
        User friend = friendship.getFriend();
        String avatarUrl = storageService.publicUrl(friend.getAvatarKey());
        return new FriendResponse(
                UserSummaryResponse.from(friend, avatarUrl),
                friendship.isFavorite(),
                friendship.getCreatedAt());
    }
}
