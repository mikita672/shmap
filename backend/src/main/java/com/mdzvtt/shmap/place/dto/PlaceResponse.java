package com.mdzvtt.shmap.place.dto;

import com.mdzvtt.shmap.place.PlaceSnapshot;

public record PlaceResponse(
        String osmId,
        String name,
        String address,
        String osmKey,
        String osmValue,
        Double latitude,
        Double longitude) {

    public static PlaceResponse from(PlaceSnapshot place) {
        if (place == null) {
            return null;
        }
        return new PlaceResponse(
                place.osmId(),
                place.name(),
                place.address(),
                place.osmKey(),
                place.osmValue(),
                place.latitude(),
                place.longitude());
    }
}
