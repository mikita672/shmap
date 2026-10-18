package com.mdzvtt.shmap.friend;

import com.mdzvtt.shmap.friend.dto.ProfileCardResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/public/profiles")
@RequiredArgsConstructor
public class ProfileCardController {
    private final PublicProfileService publicProfileService;

    @GetMapping("/{username}")
    public ProfileCardResponse profileCard(@PathVariable String username) {
        return publicProfileService.getProfileCard(username);
    }
}
