package com.mdzvtt.shmap.friend;

import com.mdzvtt.shmap.friend.dto.PublicProfileResponse;
import com.mdzvtt.shmap.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/profiles")
@RequiredArgsConstructor
public class PublicProfileController {
    private final PublicProfileService publicProfileService;

    @GetMapping("/{username}")
    public PublicProfileResponse profile(@AuthenticationPrincipal User user, @PathVariable String username) {
        return publicProfileService.getProfile(user.getId(), username);
    }
}
