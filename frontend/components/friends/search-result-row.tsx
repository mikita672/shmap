import { FriendRow } from "@/components/friends/friend-row";
import {
  useAcceptFriendRequest,
  useCancelFriendRequest,
  useSendFriendRequest,
} from "@/hooks/useFriendRequestMutations";
import { mutualFriendsSubtitle } from "@/lib/mutual-friends";
import type { UserSearchResultResponse } from "@/lib/types/api";

export interface SearchResultRowProps {
  result: UserSearchResultResponse;
}

export function SearchResultRow({ result }: SearchResultRowProps) {
  const send = useSendFriendRequest();
  const accept = useAcceptFriendRequest();
  const cancel = useCancelFriendRequest();
  const { user } = result;
  const row = {
    name: `${user.firstName} ${user.lastName}`,
    subtitle: mutualFriendsSubtitle(result),
    avatarUrl: user.avatarUrl,
    disabled: send.isPending || accept.isPending || cancel.isPending,
  };

  switch (result.relationship) {
    case "NONE":
      return (
        <FriendRow variant="add" {...row} onAdd={() => send.mutate(user.id)} />
      );
    case "REQUESTED":
      return (
        <FriendRow
          variant="sent"
          label="Requested"
          {...row}
          onCancel={() => cancel.mutate(result.requestId)}
        />
      );
    case "INCOMING":
      return (
        <FriendRow
          variant="accept"
          {...row}
          onAccept={() => accept.mutate(result.requestId)}
        />
      );
    case "FRIENDS":
      return <FriendRow variant="friends" {...row} />;
    default:
      return result satisfies never;
  }
}
