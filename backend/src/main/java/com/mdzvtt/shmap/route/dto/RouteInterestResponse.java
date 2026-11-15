package com.mdzvtt.shmap.route.dto;

import com.mdzvtt.shmap.place.PlaceCategory;
import com.mdzvtt.shmap.user.dto.UserSummaryResponse;

import java.util.List;

public record RouteInterestResponse(UserSummaryResponse user, List<PlaceCategory> categories) {
}
