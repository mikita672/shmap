import { useMemo } from "react";
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

export interface RouteLayersProps {
  route: RouteResponse;
}

export function RouteLayers({ route }: RouteLayersProps) {
  const encodedPath =
    route.path.status === "READY" ? route.path.polyline : null;
  const path = useMemo(
    () => (encodedPath ? decodePath(encodedPath) : null),
    [encodedPath],
  );

  return (
    <>
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
    </>
  );
}
