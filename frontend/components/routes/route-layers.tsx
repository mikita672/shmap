import { useMemo } from "react";
import { Platform } from "react-native";
import {
  GeoJSONSource,
  Layer,
  ViewAnnotation,
  type LineLayerSpecification,
} from "@maplibre/maplibre-react-native";
import { RoutePin } from "@/components/routes/route-pin";
import { decodePath } from "@/lib/polyline";
import type { RouteResponse } from "@/lib/types/api";

const PATH_COLOR = "#C4661F";
const PATH_CASING_COLOR = "#FEFAE0";
const LINE_LAYOUT: LineLayerSpecification["layout"] = {
  "line-cap": "round",
  "line-join": "round",
};
const ANNOTATIONS_LAYER =
  Platform.OS === "android" ? "org.maplibre.annotations.points" : undefined;

export interface RouteLayersProps {
  route: RouteResponse;
  selectedStopId?: number | null;
  onPressStop?: (stopId: number) => void;
}

export function RouteLayers({
  route,
  selectedStopId,
  onPressStop,
}: RouteLayersProps) {
  const encodedPath =
    route.path.status === "READY" ? route.path.polyline : null;
  const path = useMemo(
    () => (encodedPath ? decodePath(encodedPath) : null),
    [encodedPath],
  );

  return (
    <>
      {route.stops.map((stop, index) => (
        <ViewAnnotation
          key={`${stop.id}-${index}-${stop.id === selectedStopId}`}
          id={`stop-${stop.id}`}
          lngLat={[stop.place.longitude, stop.place.latitude]}
          anchor="center"
          onPress={onPressStop ? () => onPressStop(stop.id) : undefined}
        >
          <RoutePin number={index + 1} selected={stop.id === selectedStopId} />
        </ViewAnnotation>
      ))}

      {path && (
        <GeoJSONSource id="route-path" data={path}>
          <Layer
            id="route-path-casing"
            type="line"
            beforeId={ANNOTATIONS_LAYER}
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
            beforeId={ANNOTATIONS_LAYER}
            layout={LINE_LAYOUT}
            paint={{ "line-color": PATH_COLOR, "line-width": 5 }}
          />
        </GeoJSONSource>
      )}
    </>
  );
}
