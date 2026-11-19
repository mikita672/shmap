import { Pressable, View } from "react-native";
import { RouteMapPreview } from "@/components/chats/route-map-preview";
import { Avatar } from "@/components/ui/avatar";
import { Text } from "@/components/ui/text";
import {
  formatDistance,
  formatFeedPeople,
  formatStopCount,
  joinMeta,
} from "@/lib/route-format";
import { formatFeedTime } from "@/lib/time-ago";
import type { FeedRouteResponse } from "@/lib/types/api";

export interface FeedRouteCardProps {
  route: FeedRouteResponse;
  myId?: number;
  now: number;
  mapWidth: number;
  onPress: () => void;
  onAuthorPress: () => void;
}

const FEED_MAP_HEIGHT = 220;

export function FeedRouteCard({
  route,
  myId,
  now,
  mapWidth,
  onPress,
  onAuthorPress,
}: FeedRouteCardProps) {
  const { author, withLine } = formatFeedPeople(route.participants, myId);
  const meta = joinMeta(
    formatStopCount(route.stops.length),
    route.path.status === "READY" && formatDistance(route.path.distanceMeters),
  );

  return (
    <View className="overflow-hidden rounded-[28px] bg-action">
      <Pressable
        onPress={onAuthorPress}
        accessibilityRole="button"
        accessibilityLabel={`Open ${author}'s profile`}
        className="flex-row items-center gap-3 px-4 pb-3 pt-3.5 active:opacity-80"
      >
        <Avatar
          uri={route.participants[0]?.avatarUrl}
          size={40}
          tone="surface"
        />
        <View className="min-w-0 flex-1">
          <Text
            numberOfLines={1}
            className="text-base leading-6 tracking-[0.5px] text-action-foreground"
          >
            {author}
          </Text>
          <Text
            numberOfLines={1}
            className="text-sm leading-5 tracking-[0.25px] text-secondary"
          >
            {joinMeta(withLine, formatFeedTime(route.completedAt, now))}
          </Text>
        </View>
      </Pressable>

      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`Open route ${route.name}`}
        className="active:opacity-80"
      >
        <RouteMapPreview
          route={route}
          width={mapWidth}
          height={FEED_MAP_HEIGHT}
        />

        <View className="gap-0.5 px-4 pb-4 pt-3">
          <Text
            numberOfLines={1}
            className="text-xl leading-7 tracking-[0.5px] text-action-foreground"
          >
            {route.name}
          </Text>
          <Text className="text-sm leading-5 tracking-[0.25px] text-secondary">
            {meta}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}
