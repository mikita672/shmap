import { View } from "react-native";
import { useStaticMap } from "@/hooks/useStaticMap";
import { Ionicons } from "@/lib/icons";
import { Image } from "@/lib/image";
import { cn } from "@/lib/utils";

export interface MapPreviewProps {
  latitude: number;
  longitude: number;
  width: number;
  height: number;
  pinSize?: number;
  className?: string;
}

export function MapPreview({
  latitude,
  longitude,
  width,
  height,
  pinSize = 32,
  className,
}: MapPreviewProps) {
  const { data: uri, isError } = useStaticMap({
    latitude,
    longitude,
    width,
    height,
  });

  return (
    <View
      style={{ width, height }}
      className={cn(
        "items-center justify-center overflow-hidden bg-on-surface-muted/20",
        className,
      )}
      accessibilityRole="image"
      accessibilityLabel="Map preview"
    >
      {uri ? (
        <>
          <Image
            source={{ uri }}
            style={{ width, height }}
            contentFit="cover"
            transition={150}
          />
          <Ionicons
            name="location-sharp"
            size={pinSize}
            className="absolute text-destructive"
            style={{ top: height / 2 - pinSize, left: width / 2 - pinSize / 2 }}
          />
        </>
      ) : isError ? (
        <Ionicons
          name="map-outline"
          size={pinSize}
          className="text-on-surface-muted"
        />
      ) : null}
    </View>
  );
}
