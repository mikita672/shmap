package com.mdzvtt.shmap.push;

import com.mdzvtt.shmap.push.dto.RegisterPushTokenRequest;
import com.mdzvtt.shmap.user.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/push-tokens")
@RequiredArgsConstructor
public class PushTokenController {
    private final PushTokenService pushTokenService;

    @PutMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void register(@AuthenticationPrincipal User user, @Valid @RequestBody RegisterPushTokenRequest request) {
        pushTokenService.register(user.getId(), request.token());
    }
}
