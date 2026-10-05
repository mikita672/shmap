import type { LngLat, ViewState } from "@maplibre/maplibre-react-native";

export function halfScreensAway(
  view: ViewState,
  point: LngLat,
  zoom: number,
): number {
  const [west, south, east, north] = view.bounds;
  const scale = 2 ** (view.zoom - zoom);
  const halfWidth = ((east - west) / 2) * scale;
  const halfHeight = ((north - south) / 2) * scale;

  return Math.max(
    Math.abs(point[0] - view.center[0]) / halfWidth,
    Math.abs(point[1] - view.center[1]) / halfHeight,
  );
}

export function midpoint(a: LngLat, b: LngLat): LngLat {
  return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
}
