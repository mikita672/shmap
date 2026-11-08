package com.mdzvtt.shmap.route;

import com.mdzvtt.shmap.directions.TravelMode;
import com.mdzvtt.shmap.user.User;

import java.time.Instant;

public record RouteListRow(
                Long id,
                String name,
                TravelMode travelMode,
                Integer stopCount,
                Integer distanceMeters,
                Integer durationSeconds,
                User createdBy,
                Instant createdAt,
                Instant updatedAt) {
}
