package com.mdzvtt.shmap.friend;

import com.mdzvtt.shmap.friend.dto.FriendActivityResponse;
import com.mdzvtt.shmap.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/friend-activity")
@RequiredArgsConstructor
public class FriendActivityController {
    private final FriendActivityService friendActivityService;

    @GetMapping
    public List<FriendActivityResponse> list(@AuthenticationPrincipal User user) {
        return friendActivityService.getActivity(user.getId());
    }
}
