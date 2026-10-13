package com.mdzvtt.shmap.friend;

import com.mdzvtt.shmap.friend.dto.FriendSuggestionResponse;
import com.mdzvtt.shmap.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/friend-suggestions")
@RequiredArgsConstructor
public class FriendSuggestionController {
    private final FriendSuggestionService friendSuggestionService;

    @GetMapping
    public List<FriendSuggestionResponse> list(@AuthenticationPrincipal User user) {
        return friendSuggestionService.getSuggestions(user.getId());
    }

    @DeleteMapping("/{userId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void dismiss(@AuthenticationPrincipal User user, @PathVariable Integer userId) {
        friendSuggestionService.dismiss(user.getId(), userId);
    }
}
