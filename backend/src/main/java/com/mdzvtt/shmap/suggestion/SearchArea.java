package com.mdzvtt.shmap.suggestion;

import com.mdzvtt.shmap.directions.TravelMode;
import com.mdzvtt.shmap.directions.Waypoint;

import java.util.List;

public record SearchArea(double minLatitude, double minLongitude, double maxLatitude, double maxLongitude) {
    private static final double METERS_PER_DEGREE = 111_320;
    private static final double EARTH_RADIUS_METERS = 6_371_000;

    public static SearchArea around(List<Waypoint> points, TravelMode travelMode) {
        if (points.isEmpty()) {
            throw new IllegalArgumentException("A search area needs at least one point");
        }
        double minLatitude = points.stream().mapToDouble(Waypoint::latitude).min().orElseThrow();
        double maxLatitude = points.stream().mapToDouble(Waypoint::latitude).max().orElseThrow();
        double minLongitude = points.stream().mapToDouble(Waypoint::longitude).min().orElseThrow();
        double maxLongitude = points.stream().mapToDouble(Waypoint::longitude).max().orElseThrow();

        double padding = paddingMeters(travelMode);
        double latitudePadding = padding / METERS_PER_DEGREE;
        double middleLatitude = Math.toRadians((minLatitude + maxLatitude) / 2);
        double longitudePadding = padding / (METERS_PER_DEGREE * Math.cos(middleLatitude));

        return new SearchArea(
                Math.max(minLatitude - latitudePadding, -90),
                Math.max(minLongitude - longitudePadding, -180),
                Math.min(maxLatitude + latitudePadding, 90),
                Math.min(maxLongitude + longitudePadding, 180));
    }

    public static SearchArea near(double latitude, double longitude, TravelMode travelMode) {
        return around(List.of(new Waypoint(latitude, longitude)), travelMode);
    }

    public String bbox() {
        return minLongitude + "," + minLatitude + "," + maxLongitude + "," + maxLatitude;
    }

    public Waypoint centre() {
        return new Waypoint((minLatitude + maxLatitude) / 2, (minLongitude + maxLongitude) / 2);
    }

    public int distanceFromCentre(double latitude, double longitude) {
        Waypoint centre = centre();
        double latitudeDelta = Math.toRadians(latitude - centre.latitude());
        double longitudeDelta = Math.toRadians(longitude - centre.longitude());
        double a = Math.pow(Math.sin(latitudeDelta / 2), 2)
                + Math.cos(Math.toRadians(centre.latitude())) * Math.cos(Math.toRadians(latitude))
                        * Math.pow(Math.sin(longitudeDelta / 2), 2);
        return (int) Math.round(2 * EARTH_RADIUS_METERS * Math.asin(Math.sqrt(a)));
    }

    private static double paddingMeters(TravelMode travelMode) {
        return switch (travelMode) {
            case WALKING -> 2_000;
            case DRIVING -> 10_000;
        };
    }
}
