import { Keyboard } from "react-native";
import { router } from "expo-router";
import { FriendRow } from "@/components/friends/friend-row";
import {
  useCancelFriendRequest,
  useSendFriendRequest,
} from "@/hooks/useFriendRequestMutations";
import { useDismissFriendSuggestion } from "@/hooks/useFriendSuggestionMutations";
import { mutualFriendsSubtitle } from "@/lib/mutual-friends";
import { getProfileHref } from "@/lib/profile-link";
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
  const dismiss = useDismissFriendSuggestion();
  const { user } = suggestion;
  const row = {
    name: `${user.firstName} ${user.lastName}`,
    subtitle: mutualFriendsSubtitle(suggestion),
    avatarUrl: user.avatarUrl,
    disabled: send.isPending || cancel.isPending || dismiss.isPending,
    onPress: () => {
      Keyboard.dismiss();
      router.push(getProfileHref(user.username));
    },
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
      onDismiss={() => dismiss.mutate(user.id)}
    />
  );
}
