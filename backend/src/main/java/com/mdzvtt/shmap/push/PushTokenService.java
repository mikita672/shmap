package com.mdzvtt.shmap.push;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;

@Service
@RequiredArgsConstructor
public class PushTokenService {
    private final PushTokenRepository pushTokenRepository;

    @Transactional
    public void register(Integer userId, String token) {
        pushTokenRepository.upsert(token, userId);
        pushTokenRepository.deleteOtherTokens(userId, token);
    }

    @Transactional
    public void removeAll(Integer userId) {
        pushTokenRepository.deleteAllByUserId(userId);
    }

    @Transactional
    public void removeTokens(Collection<String> tokens) {
        pushTokenRepository.deleteByTokenIn(tokens);
    }
}
