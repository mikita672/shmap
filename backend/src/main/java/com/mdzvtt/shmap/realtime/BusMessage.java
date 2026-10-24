package com.mdzvtt.shmap.realtime;

import tools.jackson.databind.JsonNode;

import java.util.Set;

public record BusMessage(String type, Set<Integer> userIds, JsonNode data) {
}
