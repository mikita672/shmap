import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import {
  useAcceptFriendRequest,
  useCancelFriendRequest,
  useSendFriendRequest,
} from "@/hooks/useFriendRequestMutations";
import type { PublicProfileResponse } from "@/lib/types/api";

export interface RelationshipButtonProps {
  profile: PublicProfileResponse;
}

export function RelationshipButton({ profile }: RelationshipButtonProps) {
  const send = useSendFriendRequest();
  const accept = useAcceptFriendRequest();
  const cancel = useCancelFriendRequest();
  const disabled = send.isPending || accept.isPending || cancel.isPending;

  switch (profile.relationship) {
    case "NONE":
      return (
        <Button
          size="xl"
          disabled={disabled}
          onPress={() => send.mutate(profile.user.id)}
        >
          <Text className="text-2xl">Add friend</Text>
        </Button>
      );
    case "REQUESTED":
      return (
        <Button
          variant="secondary"
          size="xl"
          disabled={disabled}
          accessibilityHint="Cancels your friend request"
          onPress={() => cancel.mutate(profile.requestId)}
        >
          <Text className="text-2xl">Requested</Text>
        </Button>
      );
    case "INCOMING":
      return (
        <Button
          size="xl"
          disabled={disabled}
          onPress={() => accept.mutate(profile.requestId)}
        >
          <Text className="text-2xl">Accept</Text>
        </Button>
      );
    case "FRIENDS":
      return (
        <Button variant="secondary" size="xl" disabled>
          <Text className="text-2xl">Friends</Text>
        </Button>
      );
    case "SELF":
      return null;
    default:
      return profile satisfies never;
  }
}
