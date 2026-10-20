import { FriendRow } from "@/components/friends/friend-row";
import { useUnblockUser } from "@/hooks/useBlockMutations";
import type { BlockedUserResponse } from "@/lib/types/api";

export interface BlockedUserRowProps {
  blocked: BlockedUserResponse;
}

export function BlockedUserRow({ blocked }: BlockedUserRowProps) {
  const unblock = useUnblockUser();
  const { user } = blocked;

  return (
    <FriendRow
      variant="unblock"
      name={`${user.firstName} ${user.lastName}`}
      subtitle={`@${user.username}`}
      avatarUrl={user.avatarUrl}
      disabled={unblock.isPending}
      onUnblock={() => unblock.mutate(user)}
    />
  );
}
