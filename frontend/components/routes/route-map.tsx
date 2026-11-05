import { useMemo } from "react";
import {
  Camera,
  GeoJSONSource,
  Layer,
  Map,
  ViewAnnotation,
  type LineLayerSpecification,
} from "@maplibre/maplibre-react-native";
import "@/lib/maplibre-log-filter";
import { RoutePin } from "@/components/routes/route-pin";
import { MAP_STYLE } from "@/lib/map-style";
import { decodePath } from "@/lib/polyline";
import type { RouteResponse } from "@/lib/types/api";

const STOP_ZOOM = 14;
const WORLD_ZOOM = 1;
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
  const firstStop = route.stops[0]?.place;
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
      <Camera
        initialViewState={
          firstStop
            ? {
                center: [firstStop.longitude, firstStop.latitude],
                zoom: STOP_ZOOM,
              }
            : { zoom: WORLD_ZOOM }
        }
      />

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
