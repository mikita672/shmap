package com.mdzvtt.shmap.suggestion;

import com.mdzvtt.shmap.place.PlaceCategory;
import com.mdzvtt.shmap.place.PlaceSnapshot;

public record Candidate(String id, PlaceSnapshot place, PlaceCategory category, int distanceMeters) {
}
