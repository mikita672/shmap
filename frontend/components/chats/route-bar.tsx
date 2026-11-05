import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";
import { MaterialIcons } from "@/lib/icons";
import {
  TRAVEL_MODE_LABELS,
  formatDistance,
  formatStopCount,
  joinMeta,
} from "@/lib/route-format";
import type { RouteSummaryResponse } from "@/lib/types/api";
import { cn } from "@/lib/utils";

export interface RouteBarProps {
  route: RouteSummaryResponse;
  moreCount: number;
  onPress: () => void;
  onOpenList?: () => void;
  className?: string;
}

export function RouteBar({
  route,
  moreCount,
  onPress,
  onOpenList,
  className,
}: RouteBarProps) {
  const meta = joinMeta(
    formatStopCount(route.stopCount),
    route.distanceMeters != null && formatDistance(route.distanceMeters),
    moreCount > 0 ? `+${moreCount} more` : TRAVEL_MODE_LABELS[route.travelMode],
  );

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Open route ${route.name}`}
      onPress={onPress}
      className={cn(
        "flex-row items-center gap-3 bg-route-bar py-2 pl-4 pr-3 shadow-sm shadow-black/10 elevation-2 active:opacity-90",
        className,
      )}
    >
      <View className="h-10 w-10 items-center justify-center rounded-full bg-route-chip">
        <MaterialIcons name="route" size={22} className="text-route-icon" />
      </View>

      <View className="min-w-0 flex-1">
        <Text
          numberOfLines={1}
          className="text-[15px] font-medium leading-5 text-route-bar-foreground"
        >
          {route.name}
        </Text>
        <Text
          numberOfLines={1}
          className="text-[13px] leading-[18px] text-secondary"
        >
          {meta}
        </Text>
      </View>

      {moreCount > 0 ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="All routes in this chat"
          hitSlop={4}
          disabled={!onOpenList}
          onPress={onOpenList}
          className={cn(
            "h-10 w-10 items-center justify-center rounded-full bg-route-chip active:opacity-80",
            !onOpenList && "opacity-50",
          )}
        >
          <MaterialIcons
            name="format-list-bulleted"
            size={20}
            className="text-route-chip-foreground"
          />
        </Pressable>
      ) : (
        <MaterialIcons
          name="chevron-right"
          size={24}
          className="text-secondary"
        />
      )}
    </Pressable>
  );
}
