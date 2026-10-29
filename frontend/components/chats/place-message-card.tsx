import { View } from "react-native";
import { MapPreview } from "@/components/map-preview";
import { Text } from "@/components/ui/text";
import { MaterialIcons } from "@/lib/icons";
import type { ChatPlace } from "@/lib/types/api";
import { cn } from "@/lib/utils";

const CARD_WIDTH = 264;
const CARD_PADDING = 4;
const MAP_WIDTH = CARD_WIDTH - CARD_PADDING * 2;
const MAP_HEIGHT = 128;

export interface PlaceMessageCardProps {
  place: ChatPlace;
  time?: string;
  isMine: boolean;
  isPending?: boolean;
  isFailed?: boolean;
  senderName?: string;
}

export function PlaceMessageCard({
  place,
  time,
  isMine,
  isPending = false,
  isFailed = false,
  senderName,
}: PlaceMessageCardProps) {
  const foreground = isMine
    ? "text-bubble-out-foreground"
    : "text-bubble-in-foreground";
  const muted = isMine
    ? "text-bubble-out-muted opacity-80"
    : "text-bubble-in-muted";

  return (
    <View
      style={{ width: CARD_WIDTH, padding: CARD_PADDING }}
      className={cn(
        "rounded-[18px]",
        isMine ? "rounded-br-md bg-bubble-out" : "rounded-bl-md bg-bubble-in",
        isPending && "opacity-60",
        isFailed && "opacity-80",
      )}
    >
      {senderName ? (
        <Text
          numberOfLines={1}
          className="px-2 py-1 text-sm font-medium leading-5 text-bubble-sender"
        >
          {senderName}
        </Text>
      ) : null}
      <MapPreview
        latitude={place.latitude}
        longitude={place.longitude}
        width={MAP_WIDTH}
        height={MAP_HEIGHT}
        className="rounded-[14px]"
      />
      <View className="gap-0.5 px-2 pb-0.5 pt-2">
        <Text
          numberOfLines={1}
          className={cn("text-base font-medium leading-[22px]", foreground)}
        >
          {place.name}
        </Text>
        {place.address ? (
          <Text numberOfLines={1} className={cn("text-sm leading-5", muted)}>
            {place.address}
          </Text>
        ) : null}
      </View>
      <View className="flex-row items-center justify-between px-2 pb-0.5 pt-1">
        <Text className={cn("text-sm font-medium leading-5", foreground)}>
          Show on map
        </Text>
        {isFailed ? (
          <Text className={cn("text-xs font-medium leading-4", foreground)}>
            Not sent · Tap to retry
          </Text>
        ) : isPending ? (
          <MaterialIcons
            name="schedule"
            size={14}
            accessibilityLabel="Sending"
            className="text-bubble-out-muted"
          />
        ) : (
          <Text className={cn("text-xs leading-4", muted)}>{time}</Text>
        )}
      </View>
    </View>
  );
}
