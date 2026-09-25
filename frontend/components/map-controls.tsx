import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  type CameraRef,
  type MapRef,
  LocationManager,
} from "@maplibre/maplibre-react-native";
import { useMapControlColors } from "@/hooks/useMapControlColors";

interface MapControlsProps {
  cameraRef: React.RefObject<CameraRef | null>;
  mapRef: React.RefObject<MapRef | null>;
}

export function MapControls({ cameraRef, mapRef }: MapControlsProps) {
  const insets = useSafeAreaInsets();
  const colors = useMapControlColors();

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
    const position = await LocationManager.getCurrentPosition();
    if (position && cameraRef.current) {
      cameraRef.current.flyTo({
        center: [position.coords.longitude, position.coords.latitude],
        duration: 1000,
      });
    }
  };

  const buttonStyle = [
    styles.button,
    { backgroundColor: colors.surface ?? "hsl(52, 93%, 93%)" },
  ];

  const iconColor = colors.onSurface ?? "hsl(30, 34%, 38%)";

  return (
    <View
      style={[
        styles.container,
        {
          bottom: Math.max(insets.bottom, 8) + 56,
          right: 16,
        },
      ]}
    >
      <Pressable
        onPress={handleCompass}
        style={({ pressed }) => [
          ...buttonStyle,
          pressed && styles.buttonPressed,
        ]}
        accessibilityLabel="Reset compass to north"
        accessibilityRole="button"
      >
        <Ionicons name="compass-outline" size={24} color={iconColor} />
      </Pressable>

      <Pressable
        onPress={handleMyLocation}
        style={({ pressed }) => [
          ...buttonStyle,
          pressed && styles.buttonPressed,
        ]}
        accessibilityLabel="Go to my location"
        accessibilityRole="button"
      >
        <Ionicons name="navigate-outline" size={22} color={iconColor} />
      </Pressable>
    </View>
  );
}

const BUTTON_SIZE = 44;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    flexDirection: "column",
    gap: 12,
    alignItems: "center",
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonPressed: {
    opacity: 0.7,
  },
});
