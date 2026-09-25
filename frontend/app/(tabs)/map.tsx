import React, { useEffect, useRef, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Map,
  Camera,
  UserLocation,
  LocationManager,
  type CameraRef,
  type MapRef,
} from "@maplibre/maplibre-react-native";
import { MapControls } from "@/components/map-controls";

const MAP_STYLE = "https://tiles.openfreemap.org/styles/liberty";

export default function MapScreen() {
  const [locationPermission, setLocationPermission] = useState<boolean | null>(
    null,
  );
  const cameraRef = useRef<CameraRef>(null);
  const mapRef = useRef<MapRef>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    let cancelled = false;

    LocationManager.requestPermissions()
      .then((granted) => {
        if (!cancelled) {
          setLocationPermission(granted);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLocationPermission(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (locationPermission === null) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1">
      <Map
        ref={mapRef}
        mapStyle={MAP_STYLE}
        style={{ flex: 1 }}
        compass={false}
        attributionPosition={{ top: Math.max(insets.top, 8) + 8, left: 8 }}
      >
        {locationPermission && (
          <>
            <Camera ref={cameraRef} trackUserLocation="default" zoom={15} />
            <UserLocation animated accuracy />
          </>
        )}
      </Map>
      {locationPermission && (
        <MapControls cameraRef={cameraRef} mapRef={mapRef} />
      )}
    </View>
  );
}
