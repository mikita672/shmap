import { ActivityIndicator, Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";
import { MaterialIcons } from "@/lib/icons";
import {
  MAX_ROUTE_STOPS,
  formatDistance,
  formatStopCount,
  joinMeta,
} from "@/lib/route-format";
import type { RouteSummaryResponse } from "@/lib/types/api";
import { cn } from "@/lib/utils";

export type RoutePickerRowProps =
  | {
      variant: "route";
      route: RouteSummaryResponse;
      isAdding?: boolean;
      disabled?: boolean;
      onPress?: () => void;
    }
  | {
      variant: "new";
      disabled?: boolean;
      onPress?: () => void;
    };

export function RoutePickerRow(props: RoutePickerRowProps) {
  return props.variant === "new" ? (
    <NewRouteRow {...props} />
  ) : (
    <RouteRow {...props} />
  );
}

function RouteRow({
  route,
  isAdding = false,
  disabled = false,
  onPress,
}: Extract<RoutePickerRowProps, { variant: "route" }>) {
  const isFull = route.stopCount >= MAX_ROUTE_STOPS;
  const meta = isAdding
    ? "Adding…"
    : isFull
      ? `Full · ${MAX_ROUTE_STOPS} stops`
      : joinMeta(
          formatStopCount(route.stopCount),
          route.distanceMeters != null && formatDistance(route.distanceMeters),
        );
  const isDisabled = disabled || isFull || isAdding || !onPress;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={`Add to ${route.name}`}
      accessibilityState={{ disabled: isDisabled, busy: isAdding }}
      className={cn(
        "h-16 flex-row items-center gap-3 rounded-full bg-route pl-2 pr-4 active:opacity-80",
        (isFull || (disabled && !isAdding)) && "opacity-50",
      )}
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
      </View>

      {isAdding ? (
        <ActivityIndicator size="small" className="text-route-foreground" />
      ) : !isFull ? (
        <MaterialIcons name="add" size={24} className="text-secondary" />
      ) : null}
    </Pressable>
  );
}

function NewRouteRow({
  disabled = false,
  onPress,
}: Extract<RoutePickerRowProps, { variant: "new" }>) {
  const isDisabled = disabled || !onPress;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel="New route with this place"
      accessibilityState={{ disabled: isDisabled }}
      className={cn(
        "h-16 flex-row items-center gap-3 rounded-full border-[1.5px] border-dashed border-card-divider pl-2 pr-4 active:opacity-80",
        disabled && "opacity-50",
      )}
    >
      <View className="h-12 w-12 items-center justify-center rounded-full bg-route">
        <MaterialIcons name="add" size={24} className="text-route-foreground" />
      </View>

      <View className="min-w-0 flex-1">
        <Text
          numberOfLines={1}
          className="text-base font-medium leading-6 text-card-title"
        >
          New route
        </Text>
        <Text numberOfLines={1} className="text-sm leading-5 text-card-muted">
          Starts with this place
        </Text>
      </View>
    </Pressable>
  );
}
