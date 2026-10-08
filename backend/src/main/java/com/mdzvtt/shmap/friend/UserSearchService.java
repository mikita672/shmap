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

@Service
@RequiredArgsConstructor
public class UserSearchService {
    private static final Limit RESULT_LIMIT = Limit.of(20);

    private final UserRepository userRepository;
    private final StorageService storageService;

    @Transactional(readOnly = true)
    public List<UserSearchResultResponse> search(String query) {
        List<User> users = switch (FriendSearch.parse(query)) {
            case FriendSearch.All() -> List.of();
            case FriendSearch.Text(String text) -> userRepository.search(text, RESULT_LIMIT);
            case FriendSearch.UsernamePrefix(String prefix) -> userRepository.searchByUsername(prefix, RESULT_LIMIT);
        };
        return users.stream()
                .map(this::toResponse)
                .toList();
    }

    private UserSearchResultResponse toResponse(User user) {
        String avatarUrl = storageService.publicUrl(user.getAvatarKey());
        return new UserSearchResultResponse(UserSummaryResponse.from(user, avatarUrl));
    }
}
