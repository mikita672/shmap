import { View } from "react-native";
import { PillButton } from "@/components/ui/pill-button";
import { Text } from "@/components/ui/text";
import {
  useAcceptFriendRequest,
  useCancelFriendRequest,
  useSendFriendRequest,
} from "@/hooks/useFriendRequestMutations";
import { usePublicProfile } from "@/hooks/usePublicProfile";

export interface ReadOnlyBarProps {
  firstName: string;
  username?: string;
}

export function ReadOnlyBar({ firstName, username }: ReadOnlyBarProps) {
  const { data: profile } = usePublicProfile(username ?? "");
  const send = useSendFriendRequest();
  const accept = useAcceptFriendRequest();
  const cancel = useCancelFriendRequest();
  const disabled = send.isPending || accept.isPending || cancel.isPending;

  function renderPill() {
    if (!profile) return null;

    switch (profile.relationship) {
      case "NONE":
        return (
          <PillButton
            variant="tonal"
            label="Add friend"
            disabled={disabled}
            onPress={() => send.mutate(profile.user.id)}
          />
        );
      case "REQUESTED":
        return (
          <PillButton
            variant="tonal"
            label="Requested"
            disabled={disabled}
            accessibilityHint="Cancels your friend request"
            onPress={() => cancel.mutate(profile.requestId)}
          />
        );
      case "INCOMING":
        return (
          <PillButton
            variant="tonal"
            label="Accept"
            disabled={disabled}
            onPress={() => accept.mutate(profile.requestId)}
          />
        );
      case "FRIENDS":
      case "SELF":
        return null;
      default:
        return profile satisfies never;
    }
  }

  return (
    <View className="bg-background px-[26px] pb-3 pt-2">
      <View className="items-center gap-3 rounded-[28px] bg-action px-6 py-4">
        <View className="items-center gap-1">
          <Text className="text-center text-base font-medium leading-6 text-action-foreground">
            You&apos;re no longer friends
          </Text>
          <Text className="text-center text-sm leading-5 text-secondary">
            You can still read this chat. Add {firstName} as a friend again to
            send messages.
          </Text>
        </View>
        {renderPill()}
      </View>
    </View>
  );
}
