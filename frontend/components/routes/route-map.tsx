import { Camera, Map, ViewAnnotation } from "@maplibre/maplibre-react-native";
import "@/lib/maplibre-log-filter";
import { RoutePin } from "@/components/routes/route-pin";
import { MAP_STYLE } from "@/lib/map-style";
import type { RouteResponse } from "@/lib/types/api";

const STOP_ZOOM = 14;
const WORLD_ZOOM = 1;

export interface RouteMapProps {
  route: RouteResponse;
}

export function RouteMap({ route }: RouteMapProps) {
  const firstStop = route.stops[0]?.place;

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
