package com.mdzvtt.shmap.route;

import java.util.Set;

public record RouteDeleted(Long chatId, Long routeId, Set<Integer> recipientIds) {
}
