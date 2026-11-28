import { useQuery } from "@tanstack/react-query";
import { StaticMapImageManager } from "@maplibre/maplibre-react-native";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { MAP_STYLES } from "@/lib/map-style";

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
  const scheme = useColorScheme();

  return useQuery({
    queryKey: ["static-map", scheme, latitude, longitude, width, height],
    queryFn: () =>
      StaticMapImageManager.createImage({
        center: [longitude, latitude],
        zoom: ZOOM,
        mapStyle: MAP_STYLES[scheme],
        width,
        height,
        output: "file",
        attribution: false,
      }),
    staleTime: Infinity,
    gcTime: 30 * 60 * 1000,
    retry: 1,
  });
}
