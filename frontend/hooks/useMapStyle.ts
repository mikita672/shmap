import { useColorScheme } from "@/hooks/use-color-scheme";
import { MAP_STYLES } from "@/lib/map-style";

export function useMapStyle() {
  return MAP_STYLES[useColorScheme()];
}
