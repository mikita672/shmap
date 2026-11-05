package com.mdzvtt.shmap.route.dto;

import com.mdzvtt.shmap.place.dto.PlaceRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record AddRouteStopRequest(@NotNull(message = "Place is required") @Valid PlaceRequest place) {
}
