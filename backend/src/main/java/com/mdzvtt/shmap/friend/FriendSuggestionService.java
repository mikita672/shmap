package com.mdzvtt.shmap.friend;

import com.mdzvtt.shmap.exception.UserNotFoundException;
import com.mdzvtt.shmap.friend.dto.FriendSuggestionResponse;
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
public class FriendSuggestionService {
    private static final Limit RESULT_LIMIT = Limit.of(20);

    private final FriendshipRepository friendshipRepository;
    private final SuggestionDismissalRepository suggestionDismissalRepository;
    private final UserRepository userRepository;
    private final StorageService storageService;

    @Transactional(readOnly = true)
    public List<FriendSuggestionResponse> getSuggestions(Integer viewerId) {
        return friendshipRepository.findSuggestions(viewerId, RESULT_LIMIT).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public void dismiss(Integer userId, Integer dismissedId) {
        User dismissed = userRepository.findById(dismissedId).orElseThrow(UserNotFoundException::new);

        if (suggestionDismissalRepository.existsByUserIdAndDismissedId(userId, dismissedId)) {
            return;
        }

        User user = userRepository.getReferenceById(userId);
        suggestionDismissalRepository.save(new SuggestionDismissal(user, dismissed));
    }

    private FriendSuggestionResponse toResponse(FriendSuggestion suggestion) {
        User user = suggestion.user();
        String avatarUrl = storageService.publicUrl(user.getAvatarKey());
        return new FriendSuggestionResponse(UserSummaryResponse.from(user, avatarUrl),
                suggestion.mutualFriendsCount());
    }
}
