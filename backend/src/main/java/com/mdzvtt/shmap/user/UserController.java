package com.mdzvtt.shmap.user;

import com.mdzvtt.shmap.auth.AuthenticationResponse;
import com.mdzvtt.shmap.user.dto.ChangeEmailRequest;
import com.mdzvtt.shmap.user.dto.ChangePasswordRequest;
import com.mdzvtt.shmap.user.dto.ProfileResponse;
import com.mdzvtt.shmap.user.dto.UpdateProfileRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/me")
    public ProfileResponse me(@AuthenticationPrincipal User user) {
        return userService.getProfile(user.getId());
    }

    @PatchMapping("/me")
    public ProfileResponse updateMe(@AuthenticationPrincipal User user,
            @Valid @RequestBody UpdateProfileRequest request) {
        return userService.updateProfile(user.getId(), request);
    }

    @PatchMapping("/me/email")
    public AuthenticationResponse changeEmail(@AuthenticationPrincipal User user,
            @Valid @RequestBody ChangeEmailRequest request) {
        return userService.changeEmail(user.getId(), request);
    }

    @PatchMapping("/me/password")
    public AuthenticationResponse changePassword(@AuthenticationPrincipal User user,
            @Valid @RequestBody ChangePasswordRequest request) {
        return userService.changePassword(user.getId(), request);
    }
}
