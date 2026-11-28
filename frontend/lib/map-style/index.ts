import type { StyleSpecification } from "@maplibre/maplibre-react-native";
import { buildMapStyle } from "./build-map-style";
import liberty from "./liberty.json";
import { DARK_PALETTE, LIGHT_PALETTE } from "./palette";

const BASE_STYLE = liberty as StyleSpecification;

export const MAP_STYLES = {
  light: buildMapStyle(BASE_STYLE, LIGHT_PALETTE),
  dark: buildMapStyle(BASE_STYLE, DARK_PALETTE),
};

export const MAP_STYLE_JSON = {
  light: JSON.stringify(MAP_STYLES.light),
  dark: JSON.stringify(MAP_STYLES.dark),
};
