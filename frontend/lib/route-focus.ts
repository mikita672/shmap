import type { LngLat } from "@maplibre/maplibre-react-native";

let pendingFocus: { routeId: number; point: LngLat } | null = null;

export function setRouteFocus(routeId: number, point: LngLat) {
  pendingFocus = { routeId, point };
}

export function takeRouteFocus(routeId: number) {
  if (pendingFocus?.routeId !== routeId) return null;
  const { point } = pendingFocus;
  pendingFocus = null;
  return point;
}
