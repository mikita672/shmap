import { View } from "react-native";
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
}

export function FeedRouteCard({ route, myId, now }: FeedRouteCardProps) {
  const { author, withLine } = formatFeedPeople(route.participants, myId);
  const meta = joinMeta(
    formatStopCount(route.stops.length),
    route.path.status === "READY" && formatDistance(route.path.distanceMeters),
  );

  return (
    <View className="overflow-hidden rounded-[28px] bg-action">
      <View className="flex-row items-center gap-3 px-4 pb-3 pt-3.5">
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
      </View>

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
    </View>
  );
}
