import { useMemo } from "react";
import {
  GeoJSONSource,
  Layer,
  type FilterSpecification,
  type LineLayerSpecification,
} from "@maplibre/maplibre-react-native";
import { useTheme } from "@/hooks/useTheme";
import { buildFriendsRoutes } from "@/lib/friends-routes-geojson";
import type { FeedRouteResponse } from "@/lib/types/api";

const LINE_COLOR = { light: "#5F6F52", dark: "#A9B388" };
const CASING_COLOR = "#FEFAE0";
const LINE_WIDTH = 5;
const CASING_WIDTH = 9;
const DASH: number[] = [1.6, 1.6];
const LINE_LAYOUT: LineLayerSpecification["layout"] = {
  "line-cap": "round",
  "line-join": "round",
};
const SOLID: FilterSpecification = ["==", ["get", "dashed"], false];
const DASHED: FilterSpecification = ["==", ["get", "dashed"], true];

export interface FriendsRoutesLayerProps {
  routes: FeedRouteResponse[];
}

export function FriendsRoutesLayer({ routes }: FriendsRoutesLayerProps) {
  const { isDark } = useTheme();
  const data = useMemo(() => buildFriendsRoutes(routes), [routes]);
  const lineColor = isDark ? LINE_COLOR.dark : LINE_COLOR.light;

  return (
    <GeoJSONSource id="friends-routes" data={data}>
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
    </GeoJSONSource>
  );
}
