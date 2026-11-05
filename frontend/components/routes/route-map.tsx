import { useCallback, useEffect, useRef, useState } from "react";
import { useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import {
  Camera,
  Map,
  type CameraRef,
  type InitialViewState,
  type LngLat,
} from "@maplibre/maplibre-react-native";
import "@/lib/maplibre-log-filter";
import { RouteLayers } from "@/components/routes/route-layers";
import { getBounds } from "@/lib/map-camera";
import { MAP_STYLE } from "@/lib/map-style";
import { takeRouteFocus } from "@/lib/route-focus";
import type { RouteResponse } from "@/lib/types/api";

const STOP_ZOOM = 14;
const WORLD_ZOOM = 1;
const HEADER_SPACE = 88;
const SHEET_SHARE = 0.5;
const FIT_MARGIN = 40;
const FOCUS_DURATION = 800;

export interface RouteMapProps {
  route: RouteResponse;
  selectedStopId?: number | null;
  onSelectStop?: (stopId: number) => void;
}

export function RouteMap({
  route,
  selectedStopId,
  onSelectStop,
}: RouteMapProps) {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const cameraRef = useRef<CameraRef>(null);
  const routeId = route.id;
  const [initialViewState] = useState<InitialViewState>(() => {
    const points = route.stops.map(({ place }): LngLat => [
      place.longitude,
      place.latitude,
    ]);
    const bounds = getBounds(points);
    if (!bounds) return { zoom: WORLD_ZOOM };
    if (points.length === 1) {
      return { center: points[0], zoom: STOP_ZOOM };
    }
    return {
      bounds,
      padding: {
        top: insets.top + HEADER_SPACE,
        bottom: height * SHEET_SHARE + FIT_MARGIN,
        left: FIT_MARGIN,
        right: FIT_MARGIN,
      },
    };
  });

  const selectedPlace = route.stops.find(
    (stop) => stop.id === selectedStopId,
  )?.place;
  const selectedLng = selectedPlace?.longitude;
  const selectedLat = selectedPlace?.latitude;

  useEffect(() => {
    if (selectedLng === undefined || selectedLat === undefined) return;
    cameraRef.current?.easeTo({
      center: [selectedLng, selectedLat],
      padding: { bottom: height * SHEET_SHARE },
      duration: FOCUS_DURATION,
    });
  }, [selectedLng, selectedLat, height]);

  useFocusEffect(
    useCallback(() => {
      const point = takeRouteFocus(routeId);
      if (!point) return;
      cameraRef.current?.flyTo({
        center: point,
        zoom: STOP_ZOOM,
        padding: { bottom: height * SHEET_SHARE },
        duration: FOCUS_DURATION,
      });
    }, [routeId, height]),
  );

  return (
    <Map
      mapStyle={MAP_STYLE}
      style={{ flex: 1 }}
      compass={false}
      attributionPosition={{ bottom: 8, left: 8 }}
    >
      <Camera ref={cameraRef} initialViewState={initialViewState} />
      <RouteLayers
        route={route}
        selectedStopId={selectedStopId}
        onPressStop={onSelectStop}
      />
    </Map>
  );
}
