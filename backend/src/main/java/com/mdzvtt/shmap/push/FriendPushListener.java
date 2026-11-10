package com.mdzvtt.shmap.push;

import com.mdzvtt.shmap.friend.FriendRequestSent;
import com.mdzvtt.shmap.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;

import java.util.Map;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class FriendPushListener {
        private static final String CHANNEL = "friends";

        private final UserRepository userRepository;
        private final PushNotifier pushNotifier;

        @Async
        @TransactionalEventListener
        public void onRequestSent(FriendRequestSent event) {
                userRepository.findById(event.senderId()).ifPresent(sender -> pushNotifier.notify(
                                Set.of(event.receiverId()),
                                new PushContent(
                                                "New friend request",
                                                PushNames.fullName(sender.getFirstName(), sender.getLastName(),
                                                                sender.getPublicUsername())
                                                                + " wants to be friends",
                                                Map.of("type", "friend.request", "requestId", event.requestId()),
                                                CHANNEL,
                                                CHANNEL)));
        }
}
