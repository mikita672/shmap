import type { MapStyleJson } from "@/hooks/useMapStyle";

const PATH_COLOR = "#C4661F";
const STOP_FILL_COLOR = "#F9EBC7";
const PATH_WIDTH = 4;
const STOP_RADIUS = 3;
const STOP_STROKE_WIDTH = 3;
const SINGLE_STOP_ZOOM = 15;
const BOUNDS_PADDING = 0.2;
const MIN_SPAN_DEGREES = 0.004;

export const ROUTE_IMAGE_SOURCE_ID = "route-image";
export const ROUTE_IMAGE_LINE_LAYER_ID = "route-image-line";
export const ROUTE_IMAGE_STOPS_LAYER_ID = "route-image-stops";

export type RouteImageStop = { latitude: number; longitude: number };

export type RouteImageCamera =
  | { center: [longitude: number, latitude: number]; zoom: number }
  | { bounds: [west: number, south: number, east: number, north: number] };

function paddedRange(min: number, max: number) {
  const span = Math.max(max - min, MIN_SPAN_DEGREES);
  const middle = (min + max) / 2;
  const half = (span * (1 + 2 * BOUNDS_PADDING)) / 2;
  return [middle - half, middle + half] as const;
}

export function getRouteImageCamera(
  stops: RouteImageStop[],
): RouteImageCamera | null {
  if (stops.length === 0) return null;
  if (stops.length === 1) {
    return {
      center: [stops[0].longitude, stops[0].latitude],
      zoom: SINGLE_STOP_ZOOM,
    };
  }
  const longitudes = stops.map((stop) => stop.longitude);
  const latitudes = stops.map((stop) => stop.latitude);
  const [west, east] = paddedRange(
    Math.min(...longitudes),
    Math.max(...longitudes),
  );
  const [south, north] = paddedRange(
    Math.min(...latitudes),
    Math.max(...latitudes),
  );
  return { bounds: [west, south, east, north] };
}

export function buildRouteImageStyle(
  baseStyle: MapStyleJson,
  { line, stops }: { line: GeoJSON.LineString | null; stops: RouteImageStop[] },
): MapStyleJson {
  const features: GeoJSON.Feature[] = stops.map((stop) => ({
    type: "Feature",
    properties: { kind: "stop" },
    geometry: { type: "Point", coordinates: [stop.longitude, stop.latitude] },
  }));
  if (line) {
    features.unshift({
      type: "Feature",
      properties: { kind: "path" },
      geometry: line,
    });
  }

  return {
    ...baseStyle,
    sources: {
      ...baseStyle.sources,
      [ROUTE_IMAGE_SOURCE_ID]: {
        type: "geojson",
        data: { type: "FeatureCollection", features },
      },
    },
    layers: [
      ...baseStyle.layers,
      {
        id: ROUTE_IMAGE_LINE_LAYER_ID,
        type: "line",
        source: ROUTE_IMAGE_SOURCE_ID,
        filter: ["==", ["get", "kind"], "path"],
        layout: { "line-cap": "round", "line-join": "round" },
        paint: { "line-color": PATH_COLOR, "line-width": PATH_WIDTH },
      },
      {
        id: ROUTE_IMAGE_STOPS_LAYER_ID,
        type: "circle",
        source: ROUTE_IMAGE_SOURCE_ID,
        filter: ["==", ["get", "kind"], "stop"],
        paint: {
          "circle-radius": STOP_RADIUS,
          "circle-color": STOP_FILL_COLOR,
          "circle-stroke-width": STOP_STROKE_WIDTH,
          "circle-stroke-color": PATH_COLOR,
        },
      },
    ],
  };
}
