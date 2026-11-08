package com.mdzvtt.shmap.route.dto;

import com.mdzvtt.shmap.directions.TravelMode;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateRouteRequest(
        @NotBlank(message = "Route name is required") @Size(max = 50, message = "Route name must be at most 50 characters") String name,
        TravelMode travelMode,

        @Size(max = 2000, message = "Message must be at most 2000 characters") String message) {

    public CreateRouteRequest {
        name = name == null ? null : name.strip();
        travelMode = travelMode == null ? TravelMode.WALKING : travelMode;
        message = message == null || message.isBlank() ? null : message.strip();
    }
}
