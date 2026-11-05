package com.mdzvtt.shmap.route.dto;

import com.mdzvtt.shmap.place.dto.PlaceResponse;
import com.mdzvtt.shmap.user.dto.UserSummaryResponse;

import java.time.Instant;

public record RouteStopResponse(Long id, PlaceResponse place, UserSummaryResponse addedBy, Instant addedAt) {
}
