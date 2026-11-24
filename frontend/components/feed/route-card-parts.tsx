import { Pressable, View } from "react-native";
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

const HEADER_CLASS = "flex-row items-center gap-3 px-4 pb-3 pt-3.5";

export interface RouteCardHeaderProps {
  route: FeedRouteResponse;
  myId?: number;
  now: number;
  onAuthorPress?: () => void;
}

export function RouteCardHeader({
  route,
  myId,
  now,
  onAuthorPress,
}: RouteCardHeaderProps) {
  const { author, withLine } = formatFeedPeople(route.participants, myId);

  const content = (
    <>
      <Avatar uri={route.participants[0]?.avatarUrl} size={40} tone="surface" />
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
    </>
  );

  if (!onAuthorPress) {
    return <View className={HEADER_CLASS}>{content}</View>;
  }

  return (
    <Pressable
      onPress={onAuthorPress}
      accessibilityRole="button"
      accessibilityLabel={`Open ${author}'s profile`}
      className={`${HEADER_CLASS} active:opacity-80`}
    >
      {content}
    </Pressable>
  );
}

export interface RouteCardFooterProps {
  route: FeedRouteResponse;
}

export function RouteCardFooter({ route }: RouteCardFooterProps) {
  const meta = joinMeta(
    formatStopCount(route.stops.length),
    route.path.status === "READY" && formatDistance(route.path.distanceMeters),
  );

  return (
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
  );
}
