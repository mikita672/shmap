package com.mdzvtt.shmap.suggestion;

import com.mdzvtt.shmap.directions.TravelMode;
import com.mdzvtt.shmap.directions.Waypoint;

import java.util.List;

public record SearchArea(double minLatitude, double maxLatitude, double westLongitude, double eastLongitude) {
    private static final double METERS_PER_DEGREE = 111_320;
    private static final double EARTH_RADIUS_METERS = 6_371_000;

    public static SearchArea around(List<Waypoint> points, TravelMode travelMode) {
        if (points.isEmpty()) {
            throw new IllegalArgumentException("A search area needs at least one point");
        }
        double minLatitude = points.stream().mapToDouble(Waypoint::latitude).min().orElseThrow();
        double maxLatitude = points.stream().mapToDouble(Waypoint::latitude).max().orElseThrow();
        double[] longitudes = points.stream().mapToDouble(point -> normalize(point.longitude())).sorted().toArray();

        int afterLargestGap = 0;
        double largestGap = longitudes[0] + 360 - longitudes[longitudes.length - 1];
        for (int i = 1; i < longitudes.length; i++) {
            double gap = longitudes[i] - longitudes[i - 1];
            if (gap > largestGap) {
                largestGap = gap;
                afterLargestGap = i;
            }
        }
        double west = longitudes[afterLargestGap];
        double span = 360 - largestGap;

        double padding = paddingMeters(travelMode);
        double latitudePadding = padding / METERS_PER_DEGREE;
        double middleLatitude = Math.toRadians((minLatitude + maxLatitude) / 2);
        double longitudePadding = padding / (METERS_PER_DEGREE * Math.cos(middleLatitude));

        double paddedMinLatitude = Math.max(minLatitude - latitudePadding, -90);
        double paddedMaxLatitude = Math.min(maxLatitude + latitudePadding, 90);
        if (span + 2 * longitudePadding >= 360) {
            return new SearchArea(paddedMinLatitude, paddedMaxLatitude, -180, 180);
        }
        double paddedWest = normalize(west - longitudePadding);
        double paddedEast = normalize(west + span + longitudePadding);
        if (paddedEast == -180) {
            paddedEast = 180;
        }
        return new SearchArea(paddedMinLatitude, paddedMaxLatitude, paddedWest, paddedEast);
    }

    public static SearchArea near(double latitude, double longitude, TravelMode travelMode) {
        return around(List.of(new Waypoint(latitude, longitude)), travelMode);
    }

    public boolean crossesAntimeridian() {
        return westLongitude > eastLongitude;
    }

    public List<String> bboxes() {
        if (crossesAntimeridian()) {
            return List.of(bbox(westLongitude, 180), bbox(-180, eastLongitude));
        }
        return List.of(bbox(westLongitude, eastLongitude));
    }

    public Waypoint centre() {
        double span = crossesAntimeridian() ? eastLongitude + 360 - westLongitude : eastLongitude - westLongitude;
        return new Waypoint((minLatitude + maxLatitude) / 2, normalize(westLongitude + span / 2));
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

    private String bbox(double west, double east) {
        return west + "," + minLatitude + "," + east + "," + maxLatitude;
    }

    private static double normalize(double longitude) {
        return ((longitude + 180) % 360 + 360) % 360 - 180;
    }

    private static double paddingMeters(TravelMode travelMode) {
        return switch (travelMode) {
            case WALKING -> 2_000;
            case DRIVING -> 10_000;
        };
    }
}
