package com.mdzvtt.shmap.route.dto;

import com.mdzvtt.shmap.directions.TravelMode;
import com.mdzvtt.shmap.validation.NameOrTravelMode;
import jakarta.validation.constraints.Size;

@NameOrTravelMode
public record UpdateRouteRequest(
        @Size(min = 1, message = "Route name can't be blank") @Size(max = 50, message = "Route name must be at most 50 characters") String name,
        TravelMode travelMode) {

    public UpdateRouteRequest {
        name = name == null ? null : name.strip();
    }
}
