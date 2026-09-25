import React, { useState, useEffect } from "react";
import { View, Pressable, Animated, ActivityIndicator } from "react-native";
import { Ionicons } from "@/lib/icons";
import {
  type CameraRef,
  type MapRef,
  LocationManager,
} from "@maplibre/maplibre-react-native";

interface MapControlsProps {
  cameraRef: React.RefObject<CameraRef | null>;
  mapRef: React.RefObject<MapRef | null>;
  bearing: Animated.Value;
}

export function MapControls({ cameraRef, mapRef, bearing }: MapControlsProps) {
  const [isLocating, setIsLocating] = useState(true);

  useEffect(() => {
    let isMounted = true;

    LocationManager.getCurrentPosition().then((pos) => {
      if (isMounted && pos) {
        setIsLocating(false);
      }
    });

    const listener = () => {
      if (isMounted) {
        setIsLocating(false);
      }
    };

    LocationManager.addListener(listener);

    return () => {
      isMounted = false;
      LocationManager.removeListener(listener);
    };
  }, []);

  const handleCompass = async () => {
    if (cameraRef.current && mapRef.current) {
      const center = await mapRef.current.getCenter();
      cameraRef.current.easeTo({
        center,
        bearing: 0,
        duration: 400,
      });
    }
  };

  const handleMyLocation = async () => {
    if (isLocating) return;
    try {
      setIsLocating(true);
      const position = await LocationManager.getCurrentPosition();
      if (position && cameraRef.current && mapRef.current) {
        const currentZoom = await mapRef.current.getZoom();

        const targetZoom = Math.max(currentZoom, 15);

        cameraRef.current.flyTo({
          center: [position.coords.longitude, position.coords.latitude],
          zoom: targetZoom,
          duration: 1000,
        });
      }
    } finally {
      setIsLocating(false);
    }
  };

  const rotate = bearing.interpolate({
    inputRange: [0, 360],
    outputRange: ["-45deg", "-405deg"],
  });

  return (
    <View
      className="absolute flex-col items-center gap-3 right-4"
      style={{ bottom: 16 }}
    >
      <Pressable
        onPress={handleCompass}
        className="bg-tab-bubble active:opacity-70 w-11 h-11 rounded-full items-center justify-center shadow-sm shadow-black/10 elevation-3"
        accessibilityLabel="Reset compass to north"
        accessibilityRole="button"
      >
        <Animated.View style={{ transform: [{ rotate }] }}>
          <Ionicons
            name="compass-outline"
            size={24}
            className="text-tab-icon-active"
          />
        </Animated.View>
      </Pressable>

      <Pressable
        onPress={handleMyLocation}
        disabled={isLocating}
        className="bg-tab-bubble active:opacity-70 w-11 h-11 rounded-full items-center justify-center shadow-sm shadow-black/10 elevation-3"
        accessibilityLabel="Go to my location"
        accessibilityRole="button"
      >
        {isLocating ? (
          <ActivityIndicator size="small" color="#783D19" />
        ) : (
          <Ionicons
            name="navigate-outline"
            size={22}
            className="text-tab-icon-active"
          />
        )}
      </Pressable>
    </View>
  );
}
