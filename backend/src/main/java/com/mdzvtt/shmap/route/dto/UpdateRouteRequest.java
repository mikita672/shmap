package com.mdzvtt.shmap.route.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateRouteRequest(
        @NotBlank(message = "Route name is required") @Size(max = 50, message = "Route name must be at most 50 characters") String name) {

    public UpdateRouteRequest {
        name = name == null ? null : name.strip();
    }
}
