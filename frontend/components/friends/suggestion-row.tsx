import { FriendRow } from "@/components/friends/friend-row";
import {
  useCancelFriendRequest,
  useSendFriendRequest,
} from "@/hooks/useFriendRequestMutations";
import { mutualFriendsSubtitle } from "@/lib/mutual-friends";
import type {
  FriendRequestResponse,
  FriendSuggestionResponse,
} from "@/lib/types/api";

export interface SuggestionRowProps {
  suggestion: FriendSuggestionResponse;
  sentRequest?: FriendRequestResponse;
}

export function SuggestionRow({ suggestion, sentRequest }: SuggestionRowProps) {
  const send = useSendFriendRequest();
  const cancel = useCancelFriendRequest();
  const { user } = suggestion;
  const row = {
    name: `${user.firstName} ${user.lastName}`,
    subtitle: mutualFriendsSubtitle(suggestion),
    avatarUrl: user.avatarUrl,
    disabled: send.isPending || cancel.isPending,
  };

  if (sentRequest) {
    return (
      <FriendRow
        variant="sent"
        label="Requested"
        {...row}
        onCancel={() => cancel.mutate(sentRequest.id)}
      />
    );
  }

  return (
    <FriendRow
      variant="suggestion"
      {...row}
      onAdd={() => send.mutate(user.id)}
      onDismiss={() => {}}
    />
  );
}
