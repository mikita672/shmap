import { View } from "react-native";
import { useStaticRouteMap } from "@/hooks/useStaticRouteMap";
import "@/lib/maplibre-log-filter";
import { Ionicons } from "@/lib/icons";
import { Image } from "@/lib/image";
import type { RouteResponse } from "@/lib/types/api";
import { cn } from "@/lib/utils";

export interface RouteMapPreviewProps {
  route: RouteResponse;
  width: number;
  height: number;
  className?: string;
}

export function RouteMapPreview({
  route,
  width,
  height,
  className,
}: RouteMapPreviewProps) {
  const { data: uri, isError } = useStaticRouteMap({ route, width, height });

  return (
    <View
      style={{ width, height }}
      className={cn(
        "items-center justify-center overflow-hidden bg-on-surface-muted/20",
        className,
      )}
      accessibilityRole="image"
      accessibilityLabel="Route map preview"
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={{ width, height }}
          contentFit="cover"
          transition={150}
        />
      ) : isError ? (
        <Ionicons
          name="map-outline"
          size={36}
          className="text-on-surface-muted"
        />
      ) : null}
    </View>
  );
}
