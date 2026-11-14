package com.mdzvtt.shmap.route.dto;

import com.mdzvtt.shmap.directions.TravelMode;
import com.mdzvtt.shmap.user.dto.UserSummaryResponse;

import java.time.Instant;
import java.time.LocalDate;

public record RouteSummaryResponse(
        Long id,
        String name,
        TravelMode travelMode,
        int stopCount,
        Integer distanceMeters,
        Integer durationSeconds,
        LocalDate finishedOn,
        UserSummaryResponse createdBy,
        Instant createdAt,
        Instant updatedAt) {
}
