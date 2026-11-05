package com.mdzvtt.shmap.route.dto;

import com.mdzvtt.shmap.user.dto.UserSummaryResponse;

import java.time.Instant;
import java.util.List;

public record RouteResponse(
                Long id,
                Long chatId,
                String name,
                UserSummaryResponse createdBy,
                Instant createdAt,
                Instant updatedAt,
                boolean canEdit,
                List<RouteStopResponse> stops) {
}
