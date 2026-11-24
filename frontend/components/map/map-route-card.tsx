import { Pressable, View } from "react-native";
import {
  RouteCardFooter,
  RouteCardHeader,
} from "@/components/feed/route-card-parts";
import type { FeedRouteResponse } from "@/lib/types/api";

export interface MapRouteCardProps {
  route: FeedRouteResponse;
  myId?: number;
  now: number;
  onPress: () => void;
  onAuthorPress: () => void;
}

export function MapRouteCard({
  route,
  myId,
  now,
  onPress,
  onAuthorPress,
}: MapRouteCardProps) {
  return (
    <View className="rounded-[28px] bg-action shadow-md shadow-black/20 elevation-4">
      <View className="overflow-hidden rounded-[28px]">
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
          <RouteCardFooter route={route} />
        </Pressable>
      </View>
    </View>
  );
}
