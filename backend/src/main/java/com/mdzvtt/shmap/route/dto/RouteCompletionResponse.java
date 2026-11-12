package com.mdzvtt.shmap.route.dto;

import com.mdzvtt.shmap.route.RouteVisibility;
import com.mdzvtt.shmap.user.dto.UserSummaryResponse;

import java.time.LocalDate;
import java.util.List;

public record RouteCompletionResponse(
        LocalDate finishedOn,
        RouteVisibility visibility,
        RouteVisibility effectiveVisibility,
        List<UserSummaryResponse> participants) {
}
