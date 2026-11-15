package com.mdzvtt.shmap.suggestion.dto;

import com.mdzvtt.shmap.place.PlaceCategory;
import com.mdzvtt.shmap.place.dto.PlaceResponse;

public record RouteSuggestionResponse(Long id, PlaceResponse place, PlaceCategory category, String reason) {
}
