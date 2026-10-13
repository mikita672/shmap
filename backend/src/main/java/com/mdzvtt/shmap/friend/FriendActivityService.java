package com.mdzvtt.shmap.friend;

import com.mdzvtt.shmap.friend.dto.FriendActivityResponse;
import com.mdzvtt.shmap.storage.StorageService;
import com.mdzvtt.shmap.user.User;
import com.mdzvtt.shmap.user.dto.UserSummaryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FriendActivityService {
    private final FriendActivityRepository friendActivityRepository;
    private final StorageService storageService;

    @Transactional(readOnly = true)
    public List<FriendActivityResponse> getActivity(Integer userId) {
        return friendActivityRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    private FriendActivityResponse toResponse(FriendActivity activity) {
        User friend = activity.getFriend();
        String avatarUrl = storageService.publicUrl(friend.getAvatarKey());
        return new FriendActivityResponse(
                activity.getId(),
                activity.getType(),
                UserSummaryResponse.from(friend, avatarUrl),
                activity.getCreatedAt());
    }
}
