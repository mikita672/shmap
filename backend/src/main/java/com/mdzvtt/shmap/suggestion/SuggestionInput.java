package com.mdzvtt.shmap.suggestion;

import com.mdzvtt.shmap.directions.TravelMode;
import com.mdzvtt.shmap.place.PlaceCategory;

import java.util.EnumSet;
import java.util.List;
import java.util.Set;

public record SuggestionInput(
        TravelMode travelMode,
        List<String> stopNames,
        Set<String> osmIdsOnRoute,
        List<Set<PlaceCategory>> memberPicks,
        SearchArea area) {

    public Set<PlaceCategory> allPicks() {
        Set<PlaceCategory> all = EnumSet.noneOf(PlaceCategory.class);
        memberPicks.forEach(all::addAll);
        return all;
    }
}
