package com.mdzvtt.shmap.feed;

import com.mdzvtt.shmap.feed.dto.FeedPageResponse;
import com.mdzvtt.shmap.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/feed")
@RequiredArgsConstructor
public class FeedController {
    private final FeedService feedService;

    @GetMapping
    public FeedPageResponse getFeed(@AuthenticationPrincipal User user,
            @RequestParam(required = false) String cursor) {
        return feedService.getFeed(user.getId(), cursor);
    }
}
