import { useCallback, useEffect, useRef, useState } from "react";
import { View, ActivityIndicator, Animated, Keyboard } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Map,
  Camera,
  UserLocation,
  LocationManager,
  LogManager,
  ViewAnnotation,
  type CameraRef,
  type LngLat,
  type MapRef,
  type TrackUserLocation,
} from "@maplibre/maplibre-react-native";
import type { NativeSyntheticEvent } from "react-native";
import { MapControls } from "@/components/map-controls";
import { MapSearchBar } from "@/components/map-search-bar";
import { useSharedValue } from "react-native-reanimated";
import { PlaceDetailsSheet } from "@/components/place-details-sheet";
import { useReverseGeocoding } from "@/hooks/useReverseGeocoding";
import { Ionicons } from "@/lib/icons";
import { halfScreensAway, midpoint } from "@/lib/map-camera";
import type { SearchPlace, PlaceDetails } from "@/lib/api/geocoding";

LogManager.onLog((log) => {
  const { message, tag } = log;
  if (
    tag === "Mbgl-LocationComponent" &&
    message.includes("Failed to obtain last location update")
  ) {
    return true;
  }
  return false;
});

const MAP_STYLE = "https://tiles.openfreemap.org/styles/liberty";
const DEFAULT_ZOOM = 15;
const MY_LOCATION_DURATION = 600;
const OVERVIEW_DURATION = 800;
const FLY_IN_DURATION = 1200;

interface SelectedCoordinate {
  lat: number;
  lon: number;
}

export default function MapScreen() {
  const [locationPermission, setLocationPermission] = useState<boolean | null>(
    null,
  );
  const [trackUserLocation, setTrackUserLocation] = useState<
    TrackUserLocation | undefined
  >("default");
  const cameraRef = useRef<CameraRef>(null);
  const mapRef = useRef<MapRef>(null);
  const trackingTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const insets = useSafeAreaInsets();
  const [bearing] = useState(() => new Animated.Value(0));
  const [mapCenter, setMapCenter] = useState<{ lat: number; lon: number }>();

  const [selectedCoord, setSelectedCoord] = useState<SelectedCoordinate | null>(
    null,
  );
  const [sheetVisible, setSheetVisible] = useState(false);

  const [searchPlaceOverride, setSearchPlaceOverride] =
    useState<PlaceDetails | null>(null);

  const animatedBottomOffset = useSharedValue(0);

  const [searchQuery, setSearchQuery] = useState("");

  const {
    place: reversePlace,
    isLoading: reverseLoading,
    isError: reverseError,
    refetch: reverseRefetch,
  } = useReverseGeocoding(selectedCoord);

  const activePlace = searchPlaceOverride ?? reversePlace;
  const isLoading = reverseLoading && activePlace === null;

  const handleMapPress = useCallback(
    (event: NativeSyntheticEvent<{ lngLat: [number, number] }>) => {
      Keyboard.dismiss();
      clearTimeout(trackingTimeoutRef.current);
      setTrackUserLocation(undefined);
      const [lon, lat] = event.nativeEvent.lngLat;

      setSelectedCoord({ lat, lon });
      setSearchPlaceOverride(null);
      setSheetVisible(true);

      if (cameraRef.current) {
        cameraRef.current.easeTo({
          center: [lon, lat],
          duration: 400,
        });
      }
    },
    [],
  );

  const handlePlaceSelect = useCallback(async (place: SearchPlace) => {
    clearTimeout(trackingTimeoutRef.current);
    setTrackUserLocation(undefined);

    const coord = { lat: place.latitude, lon: place.longitude };
    setSelectedCoord(coord);

    setSearchPlaceOverride({
      id: place.id,
      name: place.name,
      displayName: place.displayName,
      category: "Place",
      latitude: place.latitude,
      longitude: place.longitude,
    });
    setSheetVisible(true);

    if (cameraRef.current && mapRef.current) {
      const currentZoom = await mapRef.current.getZoom();
      cameraRef.current.flyTo({
        center: [place.longitude, place.latitude],
        zoom: Math.max(currentZoom, 15),
        duration: 1200,
      });
    }
  }, []);

  const handleSheetClose = useCallback(() => {
    setSheetVisible(false);
    setSelectedCoord(null);
    setSearchPlaceOverride(null);
    setSearchQuery("");
  }, []);

  const handleSheetRetry = useCallback(() => {
    reverseRefetch();
  }, [reverseRefetch]);

  const handleMyLocation = useCallback(async () => {
    handleSheetClose();
    clearTimeout(trackingTimeoutRef.current);

    const position = await LocationManager.getCurrentPosition();
    if (!position || !cameraRef.current || !mapRef.current) return;

    const user: LngLat = [position.coords.longitude, position.coords.latitude];
    const view = await mapRef.current.getViewState();
    const baseZoom = Math.min(view.zoom, DEFAULT_ZOOM);
    const distance = halfScreensAway(view, user, baseZoom);

    setTrackUserLocation(undefined);

    if (distance <= 1) {
      cameraRef.current.easeTo({
        center: user,
        zoom: DEFAULT_ZOOM,
        duration: MY_LOCATION_DURATION,
      });

      trackingTimeoutRef.current = setTimeout(() => {
        setTrackUserLocation("default");
      }, MY_LOCATION_DURATION);
      return;
    }

    cameraRef.current.easeTo({
      center: midpoint(view.center, user),
      zoom: baseZoom - Math.log2(distance),
      duration: OVERVIEW_DURATION,
    });

    trackingTimeoutRef.current = setTimeout(() => {
      cameraRef.current?.flyTo({
        center: user,
        zoom: DEFAULT_ZOOM,
        duration: FLY_IN_DURATION,
      });

      trackingTimeoutRef.current = setTimeout(() => {
        setTrackUserLocation("default");
      }, FLY_IN_DURATION);
    }, OVERVIEW_DURATION);
  }, [handleSheetClose]);

  useEffect(() => {
    let cancelled = false;

    LocationManager.requestPermissions()
      .then(async (granted) => {
        if (granted) {
          await LocationManager.getCurrentPosition();
        }
        if (!cancelled) {
          setLocationPermission(granted);
          if (granted) {
            LocationManager.start();
          }
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLocationPermission(false);
        }
      });

    return () => {
      cancelled = true;
      LocationManager.stop();
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
        onPress={handleMapPress}
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
            <Camera
              ref={cameraRef}
              trackUserLocation={trackUserLocation}
              onTrackUserLocationChange={(event) => {
                setTrackUserLocation(
                  (event.nativeEvent
                    .trackUserLocation as TrackUserLocation | null) ??
                    undefined,
                );
              }}
              initialViewState={{ zoom: DEFAULT_ZOOM }}
            />
            <UserLocation animated accuracy />
          </>
        )}

        {selectedCoord && (
          <ViewAnnotation
            id="selected-place"
            lngLat={[selectedCoord.lon, selectedCoord.lat]}
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

      <MapSearchBar
        mapCenter={mapCenter}
        onPlaceSelect={handlePlaceSelect}
        onClear={handleSheetClose}
        query={searchQuery}
        onQueryChange={setSearchQuery}
      />

      {locationPermission && (
        <MapControls
          cameraRef={cameraRef}
          mapRef={mapRef}
          bearing={bearing}
          animatedBottomOffset={animatedBottomOffset}
          onMyLocation={handleMyLocation}
        />
      )}

      <PlaceDetailsSheet
        visible={sheetVisible}
        place={activePlace}
        isLoading={isLoading}
        isError={reverseError}
        onClose={handleSheetClose}
        onRetry={handleSheetRetry}
        animatedBottomOffset={animatedBottomOffset}
      />
    </View>
  );
}
