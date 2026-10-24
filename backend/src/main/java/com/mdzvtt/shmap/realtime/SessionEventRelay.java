package com.mdzvtt.shmap.realtime;

import com.mdzvtt.shmap.token.UserTokensRevoked;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;

import java.util.Map;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class SessionEventRelay {
    private final RedisEventBus bus;

    @TransactionalEventListener
    public void onTokensRevoked(UserTokensRevoked event) {
        bus.publish("user.signed-out", Set.of(event.userId()), Map.of());
    }
}
