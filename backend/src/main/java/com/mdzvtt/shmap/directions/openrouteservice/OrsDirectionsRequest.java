package com.mdzvtt.shmap.directions.openrouteservice;

import java.util.List;

public record OrsDirectionsRequest(List<List<Double>> coordinates, boolean instructions, List<Integer> radiuses) {
}
