import { FriendRow } from "@/components/friends/friend-row";
import { useSendFriendRequest } from "@/hooks/useFriendRequestMutations";
import { mutualFriendsSubtitle } from "@/lib/mutual-friends";
import type { FriendSuggestionResponse } from "@/lib/types/api";

export interface SuggestionRowProps {
  suggestion: FriendSuggestionResponse;
}

export function SuggestionRow({ suggestion }: SuggestionRowProps) {
  const send = useSendFriendRequest();
  const { user } = suggestion;

  return (
    <FriendRow
      variant="suggestion"
      name={`${user.firstName} ${user.lastName}`}
      subtitle={mutualFriendsSubtitle(suggestion)}
      avatarUrl={user.avatarUrl}
      disabled={send.isPending}
      onAdd={() => send.mutate(user.id)}
      onDismiss={() => {}}
    />
  );
}
