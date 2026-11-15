package com.mdzvtt.shmap.feed.dto;

import com.mdzvtt.shmap.directions.TravelMode;
import com.mdzvtt.shmap.route.dto.RoutePathResponse;
import com.mdzvtt.shmap.user.dto.UserSummaryResponse;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

public record FeedRouteResponse(
                Long id,
                String name,
                TravelMode travelMode,
                RoutePathResponse path,
                List<RoutePointResponse> stops,
                LocalDate finishedOn,
                Instant completedAt,
                List<UserSummaryResponse> participants) {
}
