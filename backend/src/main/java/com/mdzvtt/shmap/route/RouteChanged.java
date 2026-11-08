package com.mdzvtt.shmap.route;

import java.util.Set;

public record RouteChanged(Long chatId, Long routeId, Set<Integer> recipientIds) {
}
