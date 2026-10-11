package com.mdzvtt.shmap.user;

import com.mdzvtt.shmap.auth.AuthenticationResponse;
import com.mdzvtt.shmap.user.dto.AccountResponse;
import com.mdzvtt.shmap.user.dto.AvatarUploadRequest;
import com.mdzvtt.shmap.user.dto.AvatarUploadResponse;
import com.mdzvtt.shmap.user.dto.ChangeEmailRequest;
import com.mdzvtt.shmap.user.dto.ChangePasswordRequest;
import com.mdzvtt.shmap.user.dto.ConfirmAvatarRequest;
import com.mdzvtt.shmap.user.dto.EmailResponse;
import com.mdzvtt.shmap.user.dto.ProfileResponse;
import com.mdzvtt.shmap.user.dto.UpdateProfileRequest;
import com.mdzvtt.shmap.user.dto.UsernameAvailabilityRequest;
import com.mdzvtt.shmap.user.dto.UsernameAvailabilityResponse;
import com.mdzvtt.shmap.user.dto.UsernameResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final AvatarService avatarService;

    @GetMapping("/me")
    public ProfileResponse me(@AuthenticationPrincipal User user) {
        return userService.getProfile(user.getId());
    }

    @GetMapping("/me/username")
    public UsernameResponse username(@AuthenticationPrincipal User user) {
        return userService.getUsername(user.getId());
    }

    @GetMapping("/me/email")
    public EmailResponse email(@AuthenticationPrincipal User user) {
        return userService.getEmail(user.getId());
    }

    @GetMapping("/me/account")
    public AccountResponse account(@AuthenticationPrincipal User user) {
        return userService.getAccount(user.getId());
    }

    @GetMapping("/username-availability")
    public UsernameAvailabilityResponse usernameAvailability(
            @Valid @ModelAttribute UsernameAvailabilityRequest request) {
        return userService.checkUsernameAvailability(request.username());
    }

    @GetMapping("/me/username-availability")
    public UsernameAvailabilityResponse myUsernameAvailability(@AuthenticationPrincipal User user,
            @Valid @ModelAttribute UsernameAvailabilityRequest request) {
        return userService.checkUsernameAvailability(user.getId(), request.username());
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

    @PostMapping("/me/avatar/upload-url")
    public AvatarUploadResponse createAvatarUploadUrl(@AuthenticationPrincipal User user,
            @Valid @RequestBody AvatarUploadRequest request) {
        return avatarService.createUploadUrl(user.getId(), request);
    }

    @PostMapping("/me/avatar/confirm")
    public ProfileResponse confirmAvatar(@AuthenticationPrincipal User user,
            @Valid @RequestBody ConfirmAvatarRequest request) {
        return avatarService.confirm(user.getId(), request.key());
    }

    @DeleteMapping("/me/avatar")
    public ProfileResponse removeAvatar(@AuthenticationPrincipal User user) {
        return avatarService.remove(user.getId());
    }
}
