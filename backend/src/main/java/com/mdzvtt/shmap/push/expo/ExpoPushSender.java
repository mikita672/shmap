package com.mdzvtt.shmap.push.expo;

import com.mdzvtt.shmap.push.PushMessage;
import com.mdzvtt.shmap.push.PushResult;
import com.mdzvtt.shmap.push.PushSender;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class ExpoPushSender implements PushSender {
    private static final int BATCH_SIZE = 100;
    private static final String SOUND = "default";
    private static final String PRIORITY = "high";
    private static final String DEVICE_NOT_REGISTERED = "DeviceNotRegistered";

    private final ExpoPushApi api;

    @Override
    public List<PushResult> send(List<PushMessage> messages) {
        List<PushResult> results = new ArrayList<>(messages.size());
        for (int from = 0; from < messages.size(); from += BATCH_SIZE) {
            List<PushMessage> batch = messages.subList(from, Math.min(from + BATCH_SIZE, messages.size()));
            results.addAll(sendBatch(batch));
        }
        return results;
    }

    private List<PushResult> sendBatch(List<PushMessage> batch) {
        try {
            ExpoPushResponse response = api.send(batch.stream().map(ExpoPushSender::toExpo).toList());
            if (response == null || response.data() == null || response.data().size() != batch.size()) {
                log.warn("Expo push answered with an unexpected body: {}", response);
                return failed(batch);
            }
            List<PushResult> results = new ArrayList<>(batch.size());
            for (int i = 0; i < batch.size(); i++) {
                results.add(toResult(batch.get(i).token(), response.data().get(i)));
            }
            return results;
        } catch (RestClientException e) {
            log.warn("Expo push call failed: {}", e.getMessage());
            return failed(batch);
        }
    }

    private static PushResult toResult(String token, ExpoPushResponse.Ticket ticket) {
        if ("ok".equals(ticket.status())) {
            return new PushResult.Sent(token);
        }
        String error = ticket.details() == null ? null : ticket.details().error();
        if (DEVICE_NOT_REGISTERED.equals(error)) {
            return new PushResult.DeviceNotRegistered(token);
        }
        log.warn("Expo push rejected a message ({}): {}", error, ticket.message());
        return new PushResult.Failed(token);
    }

    private static List<PushResult> failed(List<PushMessage> batch) {
        return batch.stream().<PushResult>map(message -> new PushResult.Failed(message.token())).toList();
    }

    private static ExpoPushMessage toExpo(PushMessage message) {
        return new ExpoPushMessage(message.token(), message.title(), message.body(), message.data(), SOUND, PRIORITY,
                message.channelId(), message.threadId());
    }
}
