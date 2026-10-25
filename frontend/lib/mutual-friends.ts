import type { UserSummaryResponse } from "@/lib/types/api";

interface WithMutualFriends {
  user: UserSummaryResponse;
  mutualFriendsCount: number;
}

export function mutualFriendsLabel(count: number) {
  const friends = count === 1 ? "friend" : "friends";
  return `${count} mutual ${friends}`;
}

export function mutualFriendsSubtitle({
  user,
  mutualFriendsCount,
}: WithMutualFriends) {
  if (mutualFriendsCount <= 0) return `@${user.username}`;
  return mutualFriendsLabel(mutualFriendsCount);
}
