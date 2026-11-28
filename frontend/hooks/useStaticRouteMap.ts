import { useQuery } from "@tanstack/react-query";
import { StaticMapImageManager } from "@maplibre/maplibre-react-native";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { MAP_STYLES } from "@/lib/map-style";
import { decodePath } from "@/lib/polyline";
import {
  buildRouteImageStyle,
  getRouteImageCamera,
  type RouteMapShape,
} from "@/lib/route-map-image";

export interface StaticRouteMapOptions {
  route: RouteMapShape;
  width: number;
  height: number;
}

export function useStaticRouteMap({
  route,
  width,
  height,
}: StaticRouteMapOptions) {
  const scheme = useColorScheme();
  const { stops } = route;
  const polyline = route.path.status === "READY" ? route.path.polyline : null;
  const stopKey = stops
    .map((stop) => `${stop.latitude},${stop.longitude}`)
    .join(";");

  return useQuery({
    queryKey: [
      "static-route-map",
      scheme,
      route.id,
      polyline ?? "",
      stopKey,
      width,
      height,
    ],
    queryFn: () => {
      const camera = getRouteImageCamera(stops);
      if (!camera) throw new Error("Route image not ready");
      return StaticMapImageManager.createImage({
        ...camera,
        mapStyle: buildRouteImageStyle(MAP_STYLES[scheme], {
          line: polyline ? decodePath(polyline) : null,
          stops,
        }),
        width,
        height,
        output: "file",
      });
    },
    enabled: stops.length > 0,
    staleTime: Infinity,
    gcTime: 30 * 60 * 1000,
    retry: 1,
  });
}
