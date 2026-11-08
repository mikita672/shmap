package com.mdzvtt.shmap.route.dto;

import com.mdzvtt.shmap.directions.TravelMode;
import com.mdzvtt.shmap.user.dto.UserSummaryResponse;

import java.time.Instant;

public record RouteSummaryResponse(
                Long id,
                String name,
                TravelMode travelMode,
                int stopCount,
                Integer distanceMeters,
                Integer durationSeconds,
                UserSummaryResponse createdBy,
                Instant createdAt,
                Instant updatedAt) {
}
