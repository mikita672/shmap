package com.mdzvtt.shmap.chat.dto;

import com.mdzvtt.shmap.chat.MessagePlace;

public record ChatPlaceResponse(
        String osmId,
        String name,
        String address,
        String osmKey,
        String osmValue,
        Double latitude,
        Double longitude) {

    public static ChatPlaceResponse from(MessagePlace place) {
        if (place == null) {
            return null;
        }
        return new ChatPlaceResponse(
                place.osmId(),
                place.name(),
                place.address(),
                place.osmKey(),
                place.osmValue(),
                place.latitude(),
                place.longitude());
    }
}
