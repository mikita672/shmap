import type { StyleSpecification } from "@maplibre/maplibre-react-native";
import { buildMapStyle } from "./build-map-style";
import liberty from "./liberty.json";
import { LIGHT_PALETTE } from "./palette";

export const MAP_STYLE = buildMapStyle(
  liberty as StyleSpecification,
  LIGHT_PALETTE,
);
