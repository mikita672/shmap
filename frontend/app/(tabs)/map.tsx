import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, ActivityIndicator, Animated } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Map,
  Camera,
  UserLocation,
  LocationManager,
  ViewAnnotation,
  type CameraRef,
  type MapRef,
} from "@maplibre/maplibre-react-native";
import { MapControls } from "@/components/map-controls";
import { MapSearchBar } from "@/components/map-search-bar";
import { Ionicons } from "@/lib/icons";
import type { SearchPlace } from "@/lib/api/geocoding";

const MAP_STYLE = "https://tiles.openfreemap.org/styles/liberty";

export default function MapScreen() {
  const [locationPermission, setLocationPermission] = useState<boolean | null>(
    null,
  );
  const cameraRef = useRef<CameraRef>(null);
  const mapRef = useRef<MapRef>(null);
  const insets = useSafeAreaInsets();
  const [bearing] = useState(() => new Animated.Value(0));
  const [selectedPlace, setSelectedPlace] = useState<SearchPlace | null>(null);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lon: number }>();

  const handlePlaceSelect = useCallback(async (place: SearchPlace) => {
    setSelectedPlace(place);

    if (cameraRef.current && mapRef.current) {
      const currentZoom = await mapRef.current.getZoom();
      cameraRef.current.flyTo({
        center: [place.longitude, place.latitude],
        zoom: Math.max(currentZoom, 15),
        duration: 1200,
      });
    }
  }, []);

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
        compass={!locationPermission}
        attributionPosition={{ top: Math.max(insets.top, 8) + 8, left: 8 }}
        onRegionIsChanging={(event) => {
          bearing.setValue(event.nativeEvent.bearing);
        }}
        onRegionDidChange={(event) => {
          bearing.setValue(event.nativeEvent.bearing);
          setMapCenter({
            lat: event.nativeEvent.center[1],
            lon: event.nativeEvent.center[0],
          });
        }}
      >
        {locationPermission && (
          <>
            <Camera ref={cameraRef} trackUserLocation="default" zoom={15} />
            <UserLocation animated accuracy />
          </>
        )}

        {selectedPlace && (
          <ViewAnnotation
            id="search-result"
            lngLat={[selectedPlace.longitude, selectedPlace.latitude]}
            anchor="bottom"
          >
            <View className="items-center">
              <Ionicons
                name="location-sharp"
                size={36}
                className="text-destructive"
              />
            </View>
          </ViewAnnotation>
        )}
      </Map>

      <MapSearchBar mapCenter={mapCenter} onPlaceSelect={handlePlaceSelect} />

      {locationPermission && (
        <MapControls cameraRef={cameraRef} mapRef={mapRef} bearing={bearing} />
      )}
    </View>
  );
}
