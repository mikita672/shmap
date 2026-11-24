import { useMemo } from "react";
import type { NativeSyntheticEvent } from "react-native";
import {
  GeoJSONSource,
  Layer,
  type FilterSpecification,
  type LineLayerSpecification,
  type PressEventWithFeatures,
} from "@maplibre/maplibre-react-native";
import { useTheme } from "@/hooks/useTheme";
import { buildFriendsRoutes } from "@/lib/friends-routes-geojson";
import type { FeedRouteResponse } from "@/lib/types/api";

const LINE_COLOR = { light: "#5F6F52", dark: "#A9B388" };
const SELECTED_COLOR = { light: "#783D19", dark: "#B99470" };
const CASING_COLOR = "#FEFAE0";
const LINE_WIDTH = 5;
const CASING_WIDTH = 9;
const SELECTED_WIDTH = 7;
const SELECTED_CASING_WIDTH = 11;
const DASH: number[] = [1.6, 1.6];
const LINE_LAYOUT: LineLayerSpecification["layout"] = {
  "line-cap": "round",
  "line-join": "round",
};
const SOLID: FilterSpecification = ["==", ["get", "dashed"], false];
const DASHED: FilterSpecification = ["==", ["get", "dashed"], true];

export interface FriendsRoutesLayerProps {
  routes: FeedRouteResponse[];
  selectedRouteId: number | null;
  onPressRoute: (routeId: number) => void;
}

export function FriendsRoutesLayer({
  routes,
  selectedRouteId,
  onPressRoute,
}: FriendsRoutesLayerProps) {
  const { isDark } = useTheme();
  const data = useMemo(() => buildFriendsRoutes(routes), [routes]);
  const drawOrder = useMemo(
    () =>
      new Map(
        data.features.map((feature, index) => [feature.properties.id, index]),
      ),
    [data],
  );
  const lineColor = isDark ? LINE_COLOR.dark : LINE_COLOR.light;
  const selectedColor = isDark ? SELECTED_COLOR.dark : SELECTED_COLOR.light;
  const selected: FilterSpecification = [
    "==",
    ["get", "id"],
    selectedRouteId ?? -1,
  ];

  const handlePress = (event: NativeSyntheticEvent<PressEventWithFeatures>) => {
    event.stopPropagation();
    let topId: number | null = null;
    let topOrder = -1;
    for (const feature of event.nativeEvent.features) {
      const id = feature.properties?.id;
      const order = drawOrder.get(id);
      if (order !== undefined && order > topOrder) {
        topId = id;
        topOrder = order;
      }
    }
    if (topId !== null) onPressRoute(topId);
  };

  return (
    <GeoJSONSource id="friends-routes" data={data} onPress={handlePress}>
      <Layer
        id="friends-routes-casing"
        type="line"
        filter={SOLID}
        layout={LINE_LAYOUT}
        paint={{
          "line-color": CASING_COLOR,
          "line-width": CASING_WIDTH,
          "line-opacity": 0.55,
        }}
      />
      <Layer
        id="friends-routes-line"
        type="line"
        filter={SOLID}
        layout={LINE_LAYOUT}
        paint={{ "line-color": lineColor, "line-width": LINE_WIDTH }}
      />
      <Layer
        id="friends-routes-dashed"
        type="line"
        filter={DASHED}
        layout={LINE_LAYOUT}
        paint={{
          "line-color": lineColor,
          "line-width": LINE_WIDTH,
          "line-dasharray": DASH,
        }}
      />
      <Layer
        id="friends-routes-selected-casing"
        type="line"
        filter={selected}
        layout={LINE_LAYOUT}
        paint={{
          "line-color": CASING_COLOR,
          "line-width": SELECTED_CASING_WIDTH,
          "line-opacity": 0.55,
        }}
      />
      <Layer
        id="friends-routes-selected"
        type="line"
        filter={selected}
        layout={LINE_LAYOUT}
        paint={{ "line-color": selectedColor, "line-width": SELECTED_WIDTH }}
      />
    </GeoJSONSource>
  );
}
