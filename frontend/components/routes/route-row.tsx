import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";
import { MaterialIcons } from "@/lib/icons";
import {
  TRAVEL_MODE_LABELS,
  formatDistance,
  formatDoneMeta,
  formatRouteUpdated,
  formatStopCount,
  joinMeta,
} from "@/lib/route-format";
import type { RouteSummaryResponse } from "@/lib/types/api";

export interface RouteRowProps {
  route: RouteSummaryResponse;
  now: number;
  onPress: () => void;
}

export function RouteRow({ route, now, onPress }: RouteRowProps) {
  const stats = [
    formatStopCount(route.stopCount),
    route.distanceMeters != null && formatDistance(route.distanceMeters),
  ];
  const meta = route.finishedOn
    ? joinMeta(formatDoneMeta(route.finishedOn, now), ...stats)
    : joinMeta(...stats, TRAVEL_MODE_LABELS[route.travelMode]);
  const updated = joinMeta(
    route.createdBy.firstName,
    formatRouteUpdated(route.updatedAt, now),
  );

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Open route ${route.name}`}
      onPress={onPress}
      className="h-[76px] flex-row items-center gap-3 rounded-full bg-route pl-3 pr-4 active:bg-route/80"
    >
      <View className="h-12 w-12 items-center justify-center rounded-full bg-route-chip">
        <MaterialIcons name="route" size={24} className="text-route-icon" />
      </View>

      <View className="min-w-0 flex-1">
        <Text
          numberOfLines={1}
          className="text-base font-medium leading-6 text-route-foreground"
        >
          {route.name}
        </Text>
        <Text numberOfLines={1} className="text-sm leading-5 text-secondary">
          {meta}
        </Text>
        <Text numberOfLines={1} className="text-xs leading-4 text-secondary">
          {updated}
        </Text>
      </View>

      <MaterialIcons
        name="chevron-right"
        size={24}
        className="text-secondary"
      />
    </Pressable>
  );
}
