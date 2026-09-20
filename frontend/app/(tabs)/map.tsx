import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import {
  Map,
  Camera,
  UserLocation,
  LocationManager,
} from "@maplibre/maplibre-react-native";

const MAP_STYLE = "https://tiles.openfreemap.org/styles/liberty";

export default function MapScreen() {
  const [locationPermission, setLocationPermission] = useState<boolean | null>(
    null,
  );

  useEffect(() => {
    let cancelled = false;

    LocationManager.requestPermissions().then((granted) => {
      if (!cancelled) {
        setLocationPermission(granted);
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
      <Map mapStyle={MAP_STYLE} style={{ flex: 1 }}>
        {locationPermission && (
          <>
            <Camera trackUserLocation="default" zoom={15} />
            <UserLocation animated accuracy />
          </>
        )}
      </Map>
    </View>
  );
}
