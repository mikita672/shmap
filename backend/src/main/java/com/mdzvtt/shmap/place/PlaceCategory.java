package com.mdzvtt.shmap.place;

import java.util.List;

public enum PlaceCategory {
    MUSEUMS("osm.tourism.museum", "osm.tourism.gallery"),
    LANDMARKS("osm.historic", "osm.tourism.attraction"),
    VIEWPOINTS("osm.tourism.viewpoint"),
    PARKS("osm.leisure.park", "osm.leisure.garden"),
    FOOD("osm.amenity.restaurant"),
    CAFES("osm.amenity.cafe"),
    NIGHTLIFE("osm.amenity.bar", "osm.amenity.pub", "osm.amenity.nightclub"),
    CULTURE("osm.amenity.theatre", "osm.amenity.cinema", "osm.amenity.arts_centre"),
    FAMILY("osm.tourism.zoo", "osm.tourism.theme_park", "osm.tourism.aquarium"),
    SHOPPING("osm.shop.mall", "osm.amenity.marketplace"),
    CHURCHES("osm.amenity.place_of_worship");

    private final List<String> photonIncludes;

    PlaceCategory(String... photonIncludes) {
        this.photonIncludes = List.of(photonIncludes);
    }

    public List<String> photonIncludes() {
        return photonIncludes;
    }
}
