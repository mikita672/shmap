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
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserSearchService {
    private static final Limit RESULT_LIMIT = Limit.of(20);

    private final UserRepository userRepository;
    private final FriendshipRepository friendshipRepository;
    private final FriendRequestRepository friendRequestRepository;
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
        Map<Integer, FriendRequestIds> requestsByUserId = friendRequestRepository
                .findIdsBetween(viewerId, userIds).stream()
                .collect(Collectors.toMap(request -> request.otherUserId(viewerId), request -> request));
        Map<Integer, Long> mutualFriendsCounts = friendshipRepository
                .countMutualFriends(viewerId, userIds).stream()
                .collect(Collectors.toMap(mutual -> mutual.userId(), mutual -> mutual.count()));

        return users.stream()
                .map(user -> toResponse(viewerId, user, friendIds, requestsByUserId.get(user.getId()),
                        mutualFriendsCounts.getOrDefault(user.getId(), 0L)))
                .toList();
    }

    private UserSearchResultResponse toResponse(Integer viewerId, User user, Set<Integer> friendIds,
            FriendRequestIds request, long mutualFriendsCount) {
        String avatarUrl = storageService.publicUrl(user.getAvatarKey());
        Relationship relationship = relationshipOf(viewerId, user, friendIds, request);
        Long requestId = request == null ? null : request.id();
        return new UserSearchResultResponse(UserSummaryResponse.from(user, avatarUrl), relationship, requestId,
                mutualFriendsCount);
    }

    private Relationship relationshipOf(Integer viewerId, User user, Set<Integer> friendIds,
            FriendRequestIds request) {
        if (friendIds.contains(user.getId())) {
            return Relationship.FRIENDS;
        }
        if (request == null) {
            return Relationship.NONE;
        }
        return request.isSentBy(viewerId) ? Relationship.REQUESTED : Relationship.INCOMING;
    }
}
