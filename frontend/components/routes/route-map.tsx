import { useMemo, useState } from "react";
import { useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Camera,
  GeoJSONSource,
  Layer,
  Map,
  ViewAnnotation,
  type InitialViewState,
  type LineLayerSpecification,
  type LngLat,
} from "@maplibre/maplibre-react-native";
import "@/lib/maplibre-log-filter";
import { RoutePin } from "@/components/routes/route-pin";
import { getBounds } from "@/lib/map-camera";
import { MAP_STYLE } from "@/lib/map-style";
import { decodePath } from "@/lib/polyline";
import type { RouteResponse } from "@/lib/types/api";

const STOP_ZOOM = 14;
const WORLD_ZOOM = 1;
const HEADER_SPACE = 88;
const SHEET_SHARE = 0.5;
const FIT_MARGIN = 40;
const PATH_COLOR = "#C4661F";
const PATH_CASING_COLOR = "#FEFAE0";
const LINE_LAYOUT: LineLayerSpecification["layout"] = {
  "line-cap": "round",
  "line-join": "round",
};

export interface RouteMapProps {
  route: RouteResponse;
}

export function RouteMap({ route }: RouteMapProps) {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
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
  const encodedPath =
    route.path.status === "READY" ? route.path.polyline : null;
  const path = useMemo(
    () => (encodedPath ? decodePath(encodedPath) : null),
    [encodedPath],
  );

  return (
    <Map
      mapStyle={MAP_STYLE}
      style={{ flex: 1 }}
      compass={false}
      attributionPosition={{ bottom: 8, left: 8 }}
    >
      <Camera initialViewState={initialViewState} />

      {path && (
        <GeoJSONSource id="route-path" data={path}>
          <Layer
            id="route-path-casing"
            type="line"
            layout={LINE_LAYOUT}
            paint={{
              "line-color": PATH_CASING_COLOR,
              "line-width": 9,
              "line-opacity": 0.55,
            }}
          />
          <Layer
            id="route-path-line"
            type="line"
            layout={LINE_LAYOUT}
            paint={{ "line-color": PATH_COLOR, "line-width": 5 }}
          />
        </GeoJSONSource>
      )}

      {route.stops.map((stop, index) => (
        <ViewAnnotation
          key={stop.id}
          id={`stop-${stop.id}`}
          lngLat={[stop.place.longitude, stop.place.latitude]}
          anchor="center"
        >
          <RoutePin number={index + 1} />
        </ViewAnnotation>
      ))}
    </Map>
  );
}
