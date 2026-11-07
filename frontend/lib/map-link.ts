import type { RouteStopResponse, TravelMode } from "@/lib/types/api";

const GOOGLE_MAPS_DIRECTIONS_URL = "https://www.google.com/maps/dir/";

const GOOGLE_TRAVEL_MODES: Record<TravelMode, string> = {
  WALKING: "walking",
  DRIVING: "driving",
};

export function getGoogleMapsDirectionsUrl(
  stops: RouteStopResponse[],
  travelMode: TravelMode,
) {
  const points = stops.map(
    ({ place }) => `${place.latitude},${place.longitude}`,
  );
  const destination = points.pop();
  if (destination === undefined) return null;

  const params: [string, string][] = [
    ["api", "1"],
    ["destination", destination],
    ["travelmode", GOOGLE_TRAVEL_MODES[travelMode]],
    ["dir_action", "navigate"],
  ];
  if (points.length > 0) params.push(["waypoints", points.join("|")]);

  const query = params
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");
  return `${GOOGLE_MAPS_DIRECTIONS_URL}?${query}`;
}
