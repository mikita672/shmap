package com.mdzvtt.shmap.friend;

import com.mdzvtt.shmap.friend.dto.FriendResponse;
import com.mdzvtt.shmap.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/friends")
@RequiredArgsConstructor
public class FriendController {
    private final FriendService friendService;

    @GetMapping
    public List<FriendResponse> list(@AuthenticationPrincipal User user) {
        return friendService.getFriends(user.getId());
    }
}
