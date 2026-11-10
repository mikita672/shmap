package com.mdzvtt.shmap.configuration;

import com.mdzvtt.shmap.push.PushTokenService;
import com.mdzvtt.shmap.token.TokenRepository;
import com.mdzvtt.shmap.token.TokenService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LogoutService implements LogoutHandler {

    private final TokenRepository tokenRepository;
    private final TokenService tokenService;
    private final PushTokenService pushTokenService;

    @Override
    public void logout(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication) {
        final String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return;
        }

        final String jwt = authHeader.substring(7);
        var storedToken = tokenRepository.findByToken(jwt).orElse(null);

        if (storedToken != null) {
            Integer userId = storedToken.getUser().getId();
            tokenService.revokeAllUserTokens(userId);
            pushTokenService.removeAll(userId);
        }
    }
}
