import { View } from "react-native";
import { useStaticMap } from "@/hooks/useStaticMap";
import { Ionicons, MaterialIcons } from "@/lib/icons";
import { Image } from "@/lib/image";
import { cn } from "@/lib/utils";

const PIN_TIP = 22 / 24;

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
  pinSize = 36,
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
          <MaterialIcons
            name="location-on"
            size={pinSize}
            className="absolute text-map-pin"
            style={{
              top: height / 2 - pinSize * PIN_TIP,
              left: width / 2 - pinSize / 2,
            }}
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
