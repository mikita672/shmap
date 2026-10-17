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
      subtitle={`@${user.username}`}
      avatarUrl={user.avatarUrl}
      disabled={accept.isPending || decline.isPending}
      onAccept={() => accept.mutate(request.id)}
      onDecline={() => decline.mutate(request.id)}
    />
  );
}
