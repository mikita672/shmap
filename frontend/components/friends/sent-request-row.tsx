import { router } from "expo-router";
import { FriendRow } from "@/components/friends/friend-row";
import { useCancelFriendRequest } from "@/hooks/useFriendRequestMutations";
import { getProfileHref } from "@/lib/profile-link";
import type { FriendRequestResponse } from "@/lib/types/api";

export interface SentRequestRowProps {
  request: FriendRequestResponse;
}

export function SentRequestRow({ request }: SentRequestRowProps) {
  const cancel = useCancelFriendRequest();
  const { user } = request;

  return (
    <FriendRow
      variant="sent"
      name={`${user.firstName} ${user.lastName}`}
      subtitle={`@${user.username}`}
      avatarUrl={user.avatarUrl}
      disabled={cancel.isPending}
      onPress={() => router.push(getProfileHref(user.username))}
      onCancel={() => cancel.mutate(request.id)}
    />
  );
}
