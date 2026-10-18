import type { UserSummaryResponse } from "@/lib/types/api";

interface WithMutualFriends {
  user: UserSummaryResponse;
  mutualFriendsCount: number;
}

export function mutualFriendsSubtitle({
  user,
  mutualFriendsCount,
}: WithMutualFriends) {
  if (mutualFriendsCount <= 0) return `@${user.username}`;
  const friends = mutualFriendsCount === 1 ? "friend" : "friends";
  return `${mutualFriendsCount} mutual ${friends}`;
}
