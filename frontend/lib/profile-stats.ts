import type { ProfileStat } from "@/components/friends/profile-stats";
import { formatTotalDistance } from "@/lib/route-format";

export interface ProfileStatsInput {
  routesCount: number | null;
  distanceMeters: number | null;
  friendsCount: number | null;
  onRoutesPress?: () => void;
  onFriendsPress?: () => void;
}

export function buildProfileStats({
  routesCount,
  distanceMeters,
  friendsCount,
  onRoutesPress,
  onFriendsPress,
}: ProfileStatsInput): ProfileStat[] {
  const stats: ProfileStat[] = [];

  if (routesCount !== null) {
    stats.push({
      value: String(routesCount),
      label: routesCount === 1 ? "route" : "routes",
      onPress: onRoutesPress,
    });
  }
  if (distanceMeters !== null) {
    stats.push({
      value: formatTotalDistance(distanceMeters),
      label: "distance",
      onPress: onRoutesPress,
    });
  }
  if (friendsCount !== null) {
    stats.push({
      value: String(friendsCount),
      label: friendsCount === 1 ? "friend" : "friends",
      onPress: onFriendsPress,
    });
  }

  return stats;
}
