package com.mdzvtt.shmap.route.dto;

import com.mdzvtt.shmap.user.dto.UserSummaryResponse;

import java.time.Instant;

public record RouteSummaryResponse(
                Long id,
                String name,
                int stopCount,
                UserSummaryResponse createdBy,
                Instant createdAt,
                Instant updatedAt) {
}
