import { decodePath } from "@/lib/polyline";
import type { FeedRouteResponse } from "@/lib/types/api";

export interface FriendsRouteProperties {
  id: number;
  dashed: boolean;
}

export type FriendsRoutesCollection = GeoJSON.FeatureCollection<
  GeoJSON.LineString,
  FriendsRouteProperties
>;

function toFeature(
  route: FeedRouteResponse,
): GeoJSON.Feature<GeoJSON.LineString, FriendsRouteProperties> | null {
  if (route.path.status === "READY") {
    return {
      type: "Feature",
      geometry: decodePath(route.path.polyline),
      properties: { id: route.id, dashed: false },
    };
  }
  if (route.stops.length < 2) return null;
  return {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: route.stops.map((stop) => [stop.longitude, stop.latitude]),
    },
    properties: { id: route.id, dashed: true },
  };
}

export function buildFriendsRoutes(
  routes: FeedRouteResponse[],
): FriendsRoutesCollection {
  const features = [...routes]
    .reverse()
    .map(toFeature)
    .filter((feature) => feature !== null);
  return { type: "FeatureCollection", features };
}
