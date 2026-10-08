package com.mdzvtt.shmap.friend;

import com.mdzvtt.shmap.friend.dto.UserSearchResultResponse;
import com.mdzvtt.shmap.storage.StorageService;
import com.mdzvtt.shmap.user.User;
import com.mdzvtt.shmap.user.UserRepository;
import com.mdzvtt.shmap.user.dto.UserSummaryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Limit;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserSearchService {
    private static final Limit RESULT_LIMIT = Limit.of(20);

    private final UserRepository userRepository;
    private final FriendshipRepository friendshipRepository;
    private final StorageService storageService;

    @Transactional(readOnly = true)
    public List<UserSearchResultResponse> search(Integer viewerId, String query) {
        List<User> users = switch (FriendSearch.parse(query)) {
            case FriendSearch.All() -> List.of();
            case FriendSearch.Text(String text) -> userRepository.search(viewerId, text, RESULT_LIMIT);
            case FriendSearch.UsernamePrefix(String prefix) ->
                userRepository.searchByUsername(viewerId, prefix, RESULT_LIMIT);
        };
        if (users.isEmpty()) {
            return List.of();
        }

        List<Integer> userIds = users.stream().map(user -> user.getId()).toList();
        Set<Integer> friendIds = friendshipRepository.findFriendIdsAmong(viewerId, userIds);

        return users.stream()
                .map(user -> toResponse(user, friendIds))
                .toList();
    }

    private UserSearchResultResponse toResponse(User user, Set<Integer> friendIds) {
        String avatarUrl = storageService.publicUrl(user.getAvatarKey());
        Relationship relationship = friendIds.contains(user.getId()) ? Relationship.FRIENDS : Relationship.NONE;
        return new UserSearchResultResponse(UserSummaryResponse.from(user, avatarUrl), relationship);
    }
}
