import { Pressable, View } from "react-native";
import { RouteMapPreview } from "@/components/chats/route-map-preview";
import {
  RouteCardFooter,
  RouteCardHeader,
} from "@/components/feed/route-card-parts";
import type { FeedRouteResponse } from "@/lib/types/api";

export interface FeedRouteCardProps {
  route: FeedRouteResponse;
  myId?: number;
  now: number;
  mapWidth: number;
  onPress: () => void;
  onAuthorPress?: () => void;
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
  return (
    <View className="overflow-hidden rounded-[28px] bg-action">
      <RouteCardHeader
        route={route}
        myId={myId}
        now={now}
        onAuthorPress={onAuthorPress}
      />

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
        <RouteCardFooter route={route} />
      </Pressable>
    </View>
  );
}
