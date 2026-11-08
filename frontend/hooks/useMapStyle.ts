import { useQuery } from "@tanstack/react-query";
import { MAP_STYLE } from "@/lib/map-style";

export type MapStyleJson = {
  layers: object[];
  sources: Record<string, object>;
} & Record<string, unknown>;

export function useMapStyle() {
  return useQuery({
    queryKey: ["map-style", MAP_STYLE],
    queryFn: async () => {
      const response = await fetch(MAP_STYLE);
      if (!response.ok) {
        throw new Error(`Map style request failed: ${response.status}`);
      }
      return (await response.json()) as MapStyleJson;
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });
}
