package com.mdzvtt.shmap.user;

import com.mdzvtt.shmap.user.dto.ProfileResponse;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {
    @GetMapping("/me")
    public ProfileResponse me(@AuthenticationPrincipal User user) {
        return ProfileResponse.from(user);
    }
}
