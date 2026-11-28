import type {
  LayerSpecification,
  StyleSpecification,
} from "@maplibre/maplibre-react-native";
import type { MapPalette } from "./palette";
import { PAINT_RULES } from "./rules";

const COLOR_PROPERTY = /-color$/;
const REMOVED_LAYERS = new Set(["park_outline"]);

function applyRules(
  layer: LayerSpecification,
  palette: MapPalette,
  problems: string[],
): LayerSpecification {
  const original = ("paint" in layer ? layer.paint : undefined) ?? {};
  const overrides = PAINT_RULES.filter((rule) => rule.match.test(layer.id))
    .map((rule) => rule.paint(palette))
    .reduce<Record<string, unknown>>(
      (merged, paint) => ({ ...merged, ...paint }),
      {},
    );

  if (__DEV__) {
    for (const key of Object.keys(original)) {
      if (COLOR_PROPERTY.test(key) && !(key in overrides)) {
        problems.push(`${layer.id}: ${key} keeps its Liberty color`);
      }
    }
    const prefixes =
      layer.type === "symbol" ? ["text-", "icon-"] : [`${layer.type}-`];
    for (const key of Object.keys(overrides)) {
      if (!prefixes.some((prefix) => key.startsWith(prefix))) {
        problems.push(`${layer.id}: ${layer.type} layer can't use ${key}`);
      }
    }
  }

  if (Object.keys(overrides).length === 0) return layer;
  return {
    ...layer,
    paint: { ...original, ...overrides },
  } as LayerSpecification;
}

export function buildMapStyle(
  base: StyleSpecification,
  palette: MapPalette,
): StyleSpecification {
  const problems: string[] = [];
  const layers = base.layers
    .filter((layer) => !REMOVED_LAYERS.has(layer.id))
    .map((layer) => applyRules(layer, palette, problems));
  if (__DEV__ && problems.length > 0) {
    console.warn(`Map style rules:\n${problems.join("\n")}`);
  }
  return { ...base, light: palette.light, layers };
}
