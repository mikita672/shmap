package com.mdzvtt.shmap.push;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class PushNotifier {
    private final PushTokenRepository pushTokenRepository;
    private final PushTokenService pushTokenService;
    private final PushSender pushSender;

    public void notify(Collection<Integer> userIds, PushContent content) {
        List<String> tokens = pushTokenRepository.findTokensByUserIdIn(userIds);
        if (tokens.isEmpty()) {
            return;
        }
        List<PushMessage> messages = tokens.stream()
                .map(token -> new PushMessage(token, content.title(), content.body(), content.data(),
                        content.channelId(), content.threadId()))
                .toList();

        int sent = 0;
        int failed = 0;
        List<String> deadTokens = new ArrayList<>();
        for (PushResult result : pushSender.send(messages)) {
            switch (result) {
                case PushResult.Sent s -> sent++;
                case PushResult.DeviceNotRegistered d -> deadTokens.add(d.token());
                case PushResult.Failed f -> failed++;
            }
        }
        if (!deadTokens.isEmpty()) {
            pushTokenService.removeTokens(deadTokens);
        }
        log.info("Push {}: {} sent, {} failed, {} dead token(s) removed", content.data().get("type"), sent, failed,
                deadTokens.size());
    }
}
