import { useColorScheme } from "@/hooks/use-color-scheme";
import { MAP_STYLE_JSON } from "@/lib/map-style";

export function useMapStyle() {
  return MAP_STYLE_JSON[useColorScheme()];
}
