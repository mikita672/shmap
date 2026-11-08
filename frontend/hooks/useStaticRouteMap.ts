import { useQuery } from "@tanstack/react-query";
import { StaticMapImageManager } from "@maplibre/maplibre-react-native";
import { useMapStyle } from "@/hooks/useMapStyle";
import { decodePath } from "@/lib/polyline";
import {
  buildRouteImageStyle,
  getRouteImageCamera,
  type RouteImageStop,
} from "@/lib/route-map-image";
import type { RouteResponse } from "@/lib/types/api";

export interface StaticRouteMapOptions {
  route: RouteResponse;
  width: number;
  height: number;
}

export function useStaticRouteMap({
  route,
  width,
  height,
}: StaticRouteMapOptions) {
  const { data: baseStyle } = useMapStyle();
  const stops: RouteImageStop[] = route.stops.map((stop) => ({
    latitude: stop.place.latitude,
    longitude: stop.place.longitude,
  }));
  const polyline = route.path.status === "READY" ? route.path.polyline : null;
  const stopKey = stops
    .map((stop) => `${stop.latitude},${stop.longitude}`)
    .join(";");

  return useQuery({
    queryKey: [
      "static-route-map",
      route.id,
      polyline ?? "",
      stopKey,
      width,
      height,
    ],
    queryFn: () => {
      const camera = getRouteImageCamera(stops);
      if (!baseStyle || !camera) throw new Error("Route image not ready");
      return StaticMapImageManager.createImage({
        ...camera,
        mapStyle: buildRouteImageStyle(baseStyle, {
          line: polyline ? decodePath(polyline) : null,
          stops,
        }),
        width,
        height,
        output: "file",
      });
    },
    enabled: stops.length > 0 && baseStyle !== undefined,
    staleTime: Infinity,
    gcTime: 30 * 60 * 1000,
    retry: 1,
  });
}
