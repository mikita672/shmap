import { useUnstableNativeVariable } from "nativewind";

export function useMapControlColors() {
  const surface = useUnstableNativeVariable("--surface");
  const onSurface = useUnstableNativeVariable("--on-surface");

  return {
    surface: surface ? `hsl(${surface})` : undefined,
    onSurface: onSurface ? `hsl(${onSurface})` : undefined,
  };
}
