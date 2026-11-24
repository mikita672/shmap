import React, { useState, useEffect } from "react";
import { Pressable, Animated, ActivityIndicator } from "react-native";
import { Ionicons } from "@/lib/icons";
import {
  type CameraRef,
  type MapRef,
  LocationManager,
} from "@maplibre/maplibre-react-native";
import Reanimated, {
  useAnimatedStyle,
  type DerivedValue,
} from "react-native-reanimated";

interface MapControlsProps {
  cameraRef: React.RefObject<CameraRef | null>;
  mapRef: React.RefObject<MapRef | null>;
  bearing: Animated.Value;
  animatedBottomOffset?: DerivedValue<number>;
  onMyLocation: () => Promise<void>;
  onCompass: () => void;
  locationEnabled: boolean;
  topControl?: React.ReactNode;
}

export function MapControls({
  cameraRef,
  mapRef,
  bearing,
  animatedBottomOffset,
  onMyLocation,
  onCompass,
  locationEnabled,
  topControl,
}: MapControlsProps) {
  const [isLocating, setIsLocating] = useState(true);

  useEffect(() => {
    if (!locationEnabled) return;
    let isMounted = true;

    LocationManager.getCurrentPosition()
      .then((position) => {
        if (isMounted && position) {
          setIsLocating(false);
        }
      })
      .catch((error) => {
        console.warn("Failed to get initial position:", error);
      })
      .finally(() => {
        if (isMounted) {
          setIsLocating(false);
        }
      });

    const listener = (position: any) => {
      if (isMounted && position) {
        setIsLocating(false);
      }
    };

    LocationManager.addListener(listener);

    return () => {
      isMounted = false;
      LocationManager.removeListener(listener);
    };
  }, [locationEnabled]);

  const handleCompass = async () => {
    onCompass();
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
      await onMyLocation();
    } catch (error) {
      console.warn("Failed to get current position:", error);
    } finally {
      setIsLocating(false);
    }
  };

  const rotate = bearing.interpolate({
    inputRange: [0, 360],
    outputRange: ["-45deg", "-405deg"],
  });

  const animatedStyle = useAnimatedStyle(() => {
    const bottomOffset = animatedBottomOffset?.value ?? 0;
    return {
      transform: [{ translateY: -bottomOffset }],
    };
  });

  return (
    <Reanimated.View
      className="absolute flex-col items-center gap-3 right-4"
      style={[{ bottom: 16 }, animatedStyle]}
    >
      {topControl}

      {locationEnabled && (
        <>
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
        </>
      )}
    </Reanimated.View>
  );
}
