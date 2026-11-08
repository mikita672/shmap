import { View } from "react-native";
import { useStaticRouteMap } from "@/hooks/useStaticRouteMap";
import "@/lib/maplibre-log-filter";
import { Ionicons } from "@/lib/icons";
import { Image } from "@/lib/image";
import type { RouteResponse } from "@/lib/types/api";
import { cn } from "@/lib/utils";

const ICON_SIZE = 36;

export interface RouteMapPlaceholderProps {
  width: number;
  height: number;
  showIcon?: boolean;
  className?: string;
}

export function RouteMapPlaceholder({
  width,
  height,
  showIcon = false,
  className,
}: RouteMapPlaceholderProps) {
  return (
    <View
      style={{ width, height }}
      className={cn(
        "items-center justify-center overflow-hidden bg-on-surface-muted/20",
        className,
      )}
    >
      {showIcon ? (
        <Ionicons
          name="map-outline"
          size={ICON_SIZE}
          className="text-on-surface-muted"
        />
      ) : null}
    </View>
  );
}

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

  if (!uri) {
    return (
      <RouteMapPlaceholder
        width={width}
        height={height}
        showIcon={isError}
        className={className}
      />
    );
  }

  return (
    <View
      style={{ width, height }}
      className={cn("overflow-hidden", className)}
      accessibilityRole="image"
      accessibilityLabel="Route map preview"
    >
      <Image
        source={{ uri }}
        style={{ width, height }}
        contentFit="cover"
        transition={150}
      />
    </View>
  );
}
