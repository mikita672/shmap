import { ActivityIndicator, Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";
import { MaterialIcons } from "@/lib/icons";
import {
  TRAVEL_MODE_LABELS,
  formatDistance,
  formatDuration,
  formatStopCount,
  joinMeta,
} from "@/lib/route-format";
import type { RoutePathResponse, TravelMode } from "@/lib/types/api";

const TITLE_CLASS =
  "flex-1 text-base font-medium leading-[22px] text-on-surface";
const META_CLASS = "text-[13px] leading-[18px] text-on-surface-muted";

export interface PathSummaryProps {
  path: RoutePathResponse;
  stopCount: number;
  travelMode: TravelMode;
  isCalculating?: boolean;
  onRetry?: () => void;
}

export function PathSummary({
  path,
  stopCount,
  travelMode,
  isCalculating = false,
  onRetry,
}: PathSummaryProps) {
  const meta = joinMeta(
    formatStopCount(stopCount),
    TRAVEL_MODE_LABELS[travelMode],
  );

  if (isCalculating || path.status === "PENDING") {
    return (
      <View className="gap-0.5">
        <View className="flex-row items-center gap-2">
          <ActivityIndicator size="small" className="text-on-surface" />
          <Text className={TITLE_CLASS}>Calculating the path…</Text>
        </View>
        <Text className={META_CLASS}>{meta}</Text>
      </View>
    );
  }

  switch (path.status) {
    case "READY":
      return (
        <View className="gap-0.5">
          <Text className="text-xl font-medium leading-7 text-on-surface">
            {joinMeta(
              formatDistance(path.distanceMeters),
              formatDuration(path.durationSeconds),
            )}
          </Text>
          <Text className={META_CLASS}>{meta}</Text>
        </View>
      );
    case "NO_ROUTE":
      return (
        <View className="gap-0.5">
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="error" size={18} className="text-route-icon" />
            <Text className={TITLE_CLASS}>No path between these stops</Text>
          </View>
          <Text className={META_CLASS}>
            {travelMode === "WALKING"
              ? "Try driving, or move a stop closer to a road"
              : "Move a stop closer to a road"}
          </Text>
        </View>
      );
    case "UNAVAILABLE":
      return (
        <View className="items-start gap-0.5">
          <View className="flex-row items-center gap-2">
            <MaterialIcons
              name="cloud-off"
              size={20}
              className="text-on-surface"
            />
            <Text className={TITLE_CLASS}>Couldn&apos;t load the path</Text>
          </View>
          {onRetry && (
            <Pressable
              onPress={onRetry}
              accessibilityRole="button"
              hitSlop={8}
              className="flex-row items-center gap-1 pt-0.5 active:opacity-60"
            >
              <MaterialIcons
                name="refresh"
                size={16}
                className="text-route-icon"
              />
              <Text className="text-sm font-medium leading-5 text-route-icon">
                Try again
              </Text>
            </Pressable>
          )}
        </View>
      );
    case "NONE":
      return stopCount === 0 ? (
        <View className="gap-0.5">
          <Text className={TITLE_CLASS}>No stops yet</Text>
          <Text className={META_CLASS}>
            Add the places you want to visit. Everyone in the chat can add
            theirs.
          </Text>
        </View>
      ) : (
        <View className="gap-0.5">
          <Text className={TITLE_CLASS}>Add one more stop</Text>
          <Text className={META_CLASS}>
            Distance and time show up from 2 stops
          </Text>
        </View>
      );
  }
}
