package com.mdzvtt.shmap.chat.dto;

import com.mdzvtt.shmap.chat.MessagePlace;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ChatPlaceRequest(
        @Size(max = 32, message = "OSM id must be at most 32 characters") String osmId,

        @NotBlank(message = "Place name is required") @Size(max = 200, message = "Place name must be at most 200 characters") String name,

        @Size(max = 300, message = "Address must be at most 300 characters") String address,

        @Size(max = 50, message = "OSM key must be at most 50 characters") String osmKey,

        @Size(max = 50, message = "OSM value must be at most 50 characters") String osmValue,

        @NotNull(message = "Latitude is required") @DecimalMin(value = "-90", message = "Latitude must be between -90 and 90") @DecimalMax(value = "90", message = "Latitude must be between -90 and 90") Double latitude,

        @NotNull(message = "Longitude is required") @DecimalMin(value = "-180", message = "Longitude must be between -180 and 180") @DecimalMax(value = "180", message = "Longitude must be between -180 and 180") Double longitude) {

    public ChatPlaceRequest {
        osmId = stripToNull(osmId);
        name = name == null ? null : name.strip();
        address = stripToNull(address);
        osmKey = stripToNull(osmKey);
        osmValue = stripToNull(osmValue);
    }

    public MessagePlace toPlace() {
        return new MessagePlace(osmId, name, address, osmKey, osmValue, latitude, longitude);
    }

    private static String stripToNull(String value) {
        if (value == null) {
            return null;
        }
        String stripped = value.strip();
        return stripped.isEmpty() ? null : stripped;
    }
}
