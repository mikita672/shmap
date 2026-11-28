import type { StyleSpecification } from "@maplibre/maplibre-react-native";
import { buildMapStyle } from "./build-map-style";
import liberty from "./liberty.json";

export const MAP_STYLE = buildMapStyle(liberty as StyleSpecification);
