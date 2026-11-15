package com.mdzvtt.shmap.route.dto;

import com.mdzvtt.shmap.place.PlaceCategory;
import jakarta.validation.constraints.NotNull;

import java.util.Set;

public record RouteInterestsRequest(
        @NotNull(message = "Categories are required") Set<@NotNull(message = "Category must not be null") PlaceCategory> categories) {
}
