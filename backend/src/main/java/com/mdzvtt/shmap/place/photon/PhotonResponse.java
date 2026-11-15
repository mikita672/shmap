package com.mdzvtt.shmap.place.photon;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record PhotonResponse(List<Feature> features) {

    public record Feature(Geometry geometry, Properties properties) {
    }

    public record Geometry(List<Double> coordinates) {
    }

    public record Properties(
            @JsonProperty("osm_type") String osmType,
            @JsonProperty("osm_id") Long osmId,
            @JsonProperty("osm_key") String osmKey,
            @JsonProperty("osm_value") String osmValue,
            String name,
            String street,
            String housenumber,
            String city) {
    }
}
