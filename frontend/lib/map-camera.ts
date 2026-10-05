import type { LngLat, ViewState } from "@maplibre/maplibre-react-native";

const MS_PER_ZOOM_LEVEL = 250;
const MIN_FLY_DURATION = 800;
const MAX_FLY_DURATION = 2500;

function halfScreensAway(view: ViewState, point: LngLat, zoom: number): number {
  const [west, south, east, north] = view.bounds;
  const scale = 2 ** (view.zoom - zoom);
  const halfWidth = ((east - west) / 2) * scale;
  const halfHeight = ((north - south) / 2) * scale;

  return Math.max(
    Math.abs(point[0] - view.center[0]) / halfWidth,
    Math.abs(point[1] - view.center[1]) / halfHeight,
  );
}

export function getFlyDuration(
  view: ViewState,
  target: LngLat,
  zoom: number,
): number {
  const distance = halfScreensAway(view, target, Math.min(view.zoom, zoom));
  const zoomLevels = Math.abs(view.zoom - zoom) + 2 * Math.log2(1 + distance);

  return Math.min(
    Math.max(zoomLevels * MS_PER_ZOOM_LEVEL, MIN_FLY_DURATION),
    MAX_FLY_DURATION,
  );
}

export function waitForAnimation(
  duration: number,
  signal: AbortSignal,
): Promise<void> {
  return new Promise((resolve) => {
    const timeout = setTimeout(resolve, duration);
    signal.addEventListener("abort", () => {
      clearTimeout(timeout);
      resolve();
    });
  });
}
