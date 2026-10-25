import { router } from "expo-router";
import { FriendRow } from "@/components/friends/friend-row";
import {
  useAcceptFriendRequest,
  useDeclineFriendRequest,
} from "@/hooks/useFriendRequestMutations";
import { mutualFriendsSubtitle } from "@/lib/mutual-friends";
import { getProfileHref } from "@/lib/profile-link";
import type { FriendRequestResponse } from "@/lib/types/api";

export interface IncomingRequestRowProps {
  request: FriendRequestResponse;
}

export function IncomingRequestRow({ request }: IncomingRequestRowProps) {
  const accept = useAcceptFriendRequest();
  const decline = useDeclineFriendRequest();
  const { user } = request;

  return (
    <FriendRow
      variant="request"
      name={`${user.firstName} ${user.lastName}`}
      subtitle={mutualFriendsSubtitle(request)}
      avatarUrl={user.avatarUrl}
      disabled={accept.isPending || decline.isPending}
      onPress={() => router.push(getProfileHref(user.username))}
      onAccept={() => accept.mutate(request.id)}
      onDecline={() => decline.mutate(request.id)}
    />
  );
}
