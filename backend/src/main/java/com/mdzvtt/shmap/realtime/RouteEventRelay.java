package com.mdzvtt.shmap.realtime;

import com.mdzvtt.shmap.realtime.dto.RouteEventPayload;
import com.mdzvtt.shmap.route.RouteChanged;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public class RouteEventRelay {
    private final RedisEventBus bus;

    @TransactionalEventListener
    public void onRouteChanged(RouteChanged event) {
        bus.publish("route.changed", event.recipientIds(), new RouteEventPayload(event.chatId(), event.routeId()));
    }
}
