import { FriendRow } from "@/components/friends/friend-row";
import {
  useAcceptFriendRequest,
  useDeclineFriendRequest,
} from "@/hooks/useFriendRequestMutations";
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
      subtitle={incomingRequestSubtitle(request)}
      avatarUrl={user.avatarUrl}
      disabled={accept.isPending || decline.isPending}
      onAccept={() => accept.mutate(request.id)}
      onDecline={() => decline.mutate(request.id)}
    />
  );
}

function incomingRequestSubtitle({
  user,
  mutualFriendsCount,
}: FriendRequestResponse) {
  if (mutualFriendsCount <= 0) return `@${user.username}`;
  const friends = mutualFriendsCount === 1 ? "friend" : "friends";
  return `${mutualFriendsCount} mutual ${friends}`;
}
