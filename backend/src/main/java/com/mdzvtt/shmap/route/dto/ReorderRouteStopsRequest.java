package com.mdzvtt.shmap.route.dto;

import jakarta.validation.constraints.NotNull;

import java.util.List;

public record ReorderRouteStopsRequest(
                @NotNull(message = "Stop ids are required") List<@NotNull(message = "Stop id must not be null") Long> stopIds) {
}
