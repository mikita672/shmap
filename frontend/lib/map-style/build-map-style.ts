import type {
  LightSpecification,
  StyleSpecification,
} from "@maplibre/maplibre-react-native";

const LIGHT: LightSpecification = {
  anchor: "viewport",
  color: "#ffffff",
  intensity: 0.2,
  position: [1.15, 210, 30],
};

export function buildMapStyle(base: StyleSpecification): StyleSpecification {
  return {
    ...base,
    light: LIGHT,
    layers: base.layers.map((layer) =>
      layer.type === "fill-extrusion" && layer.id === "building-3d"
        ? {
            ...layer,
            paint: {
              ...layer.paint,
              "fill-extrusion-opacity": 1,
              "fill-extrusion-vertical-gradient": false,
            },
          }
        : layer,
    ),
  };
}
