package com.mdzvtt.shmap.route.dto;

import com.mdzvtt.shmap.directions.TravelMode;
import com.mdzvtt.shmap.user.dto.UserSummaryResponse;

import java.time.Instant;
import java.util.List;

public record RouteResponse(
                Long id,
                Long chatId,
                String name,
                TravelMode travelMode,
                RoutePathResponse path,
                UserSummaryResponse createdBy,
                Instant createdAt,
                Instant updatedAt,
                boolean member,
                boolean canEdit,
                RouteCompletionResponse completion,
                List<RouteStopResponse> stops) {
}
