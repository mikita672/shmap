import type {
  LayerSpecification,
  StyleSpecification,
} from "@maplibre/maplibre-react-native";
import type { MapPalette } from "./palette";
import { PAINT_RULES } from "./rules";

function applyRules(
  layer: LayerSpecification,
  palette: MapPalette,
): LayerSpecification {
  const overrides = PAINT_RULES.filter((rule) => rule.match.test(layer.id));
  if (overrides.length === 0 || !("paint" in layer)) return layer;

  const paint = overrides.reduce<Record<string, unknown>>(
    (merged, rule) => ({ ...merged, ...rule.paint(palette) }),
    { ...layer.paint },
  );
  return { ...layer, paint } as LayerSpecification;
}

export function buildMapStyle(
  base: StyleSpecification,
  palette: MapPalette,
): StyleSpecification {
  return {
    ...base,
    light: palette.light,
    layers: base.layers.map((layer) => applyRules(layer, palette)),
  };
}
