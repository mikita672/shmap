import { Pressable, View } from "react-native";
import {
  RouteMapPlaceholder,
  RouteMapPreview,
} from "@/components/chats/route-map-preview";
import { Text } from "@/components/ui/text";
import { MaterialIcons } from "@/lib/icons";
import {
  formatDistance,
  formatStopCount,
  joinMeta,
  TRAVEL_MODE_LABELS,
} from "@/lib/route-format";
import type { RouteResponse } from "@/lib/types/api";
import { cn } from "@/lib/utils";

const CARD_WIDTH = 264;
const CARD_PADDING = 4;
const MAP_WIDTH = CARD_WIDTH - CARD_PADDING * 2;
const MAP_HEIGHT = 128;

export type RouteMessageCardState =
  | { state: "active"; route: RouteResponse }
  | { state: "loading" | "error" | "deleted"; route?: undefined };

export type RouteMessageCardProps = RouteMessageCardState & {
  name: string;
  text: string | null;
  time?: string;
  isMine: boolean;
  senderName?: string;
  onSenderPress?: () => void;
};

function getRouteCardMeta(route: RouteResponse) {
  const mode = TRAVEL_MODE_LABELS[route.travelMode];
  if (route.stops.length === 0) return joinMeta("No stops yet", mode);
  return joinMeta(
    formatStopCount(route.stops.length),
    route.path.status === "READY" && formatDistance(route.path.distanceMeters),
    mode,
  );
}

export function RouteMessageCard({
  name,
  text,
  time,
  isMine,
  senderName,
  onSenderPress,
  ...rest
}: RouteMessageCardProps) {
  const foreground = isMine
    ? "text-bubble-out-foreground"
    : "text-bubble-in-foreground";
  const muted = isMine
    ? "text-bubble-out-muted opacity-80"
    : "text-bubble-in-muted";
  const isDeleted = rest.state === "deleted";
  const isDone = rest.state === "active" && rest.route.completion !== null;
  const chipFill = isMine
    ? "bg-bubble-out-foreground"
    : "bg-bubble-in-foreground";
  const chipInk = isMine ? "text-bubble-out" : "text-bubble-in";
  const meta =
    rest.state === "active"
      ? getRouteCardMeta(rest.route)
      : isDeleted
        ? "This route was deleted"
        : null;

  return (
    <View
      style={{ width: CARD_WIDTH, padding: CARD_PADDING }}
      className={cn(
        "rounded-[18px]",
        isMine ? "rounded-br-md bg-bubble-out" : "rounded-bl-md bg-bubble-in",
      )}
    >
      {senderName ? (
        <Pressable
          onPress={onSenderPress}
          disabled={!onSenderPress}
          accessibilityRole={onSenderPress ? "button" : undefined}
          accessibilityHint={onSenderPress ? "Opens their profile" : undefined}
          className="self-start active:opacity-80"
        >
          <Text
            numberOfLines={1}
            className="px-2 py-1 text-sm font-medium leading-5 text-bubble-sender"
          >
            {senderName}
          </Text>
        </Pressable>
      ) : null}
      {rest.state === "active" ? (
        rest.route.stops.length > 0 ? (
          <RouteMapPreview
            route={rest.route}
            width={MAP_WIDTH}
            height={MAP_HEIGHT}
            className="rounded-[14px]"
          />
        ) : null
      ) : rest.state === "deleted" ? null : (
        <RouteMapPlaceholder
          width={MAP_WIDTH}
          height={MAP_HEIGHT}
          showIcon={rest.state === "error"}
          className="rounded-[14px]"
        />
      )}
      <View className="gap-0.5 px-2 pb-0.5 pt-2">
        <View className="flex-row items-center gap-1.5 pb-0.5">
          <MaterialIcons name="route" size={14} className={muted} />
          <Text className={cn("text-xs font-medium leading-4", muted)}>
            {isDeleted ? "Route deleted" : "Shared route"}
          </Text>
          {isDone && (
            <View
              className={cn(
                "flex-row items-center gap-1 rounded-full py-px pl-1 pr-2",
                chipFill,
              )}
            >
              <MaterialIcons
                name="check-circle"
                size={12}
                className={chipInk}
              />
              <Text className={cn("text-xs font-medium leading-4", chipInk)}>
                Done
              </Text>
            </View>
          )}
        </View>
        <Text
          numberOfLines={1}
          className={cn(
            "text-base font-medium leading-[22px]",
            isDeleted ? muted : foreground,
          )}
        >
          {rest.state === "active" ? rest.route.name : name}
        </Text>
        {meta ? (
          <Text numberOfLines={1} className={cn("text-sm leading-5", muted)}>
            {meta}
          </Text>
        ) : null}
        {text ? (
          <Text className={cn("text-[15px] leading-5", foreground)}>
            {text}
          </Text>
        ) : null}
      </View>
      <View className="flex-row items-center justify-between px-2 pb-0.5 pt-1">
        {isDeleted ? null : (
          <Text className={cn("text-sm font-medium leading-5", foreground)}>
            Open route
          </Text>
        )}
        <Text className={cn("text-xs leading-4", muted)}>{time}</Text>
      </View>
    </View>
  );
}
