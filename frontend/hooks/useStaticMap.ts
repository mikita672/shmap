import { useQuery } from "@tanstack/react-query";
import { StaticMapImageManager } from "@maplibre/maplibre-react-native";
import { MAP_STYLE } from "@/lib/map-style";

const ZOOM = 15;

export interface StaticMapOptions {
  latitude: number;
  longitude: number;
  width: number;
  height: number;
}

export function useStaticMap({
  latitude,
  longitude,
  width,
  height,
}: StaticMapOptions) {
  return useQuery({
    queryKey: ["static-map", latitude, longitude, width, height],
    queryFn: () =>
      StaticMapImageManager.createImage({
        center: [longitude, latitude],
        zoom: ZOOM,
        mapStyle: MAP_STYLE,
        width,
        height,
        output: "file",
      }),
    staleTime: Infinity,
    gcTime: 30 * 60 * 1000,
    retry: 1,
  });
}
