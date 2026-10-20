import { FriendRow } from "@/components/friends/friend-row";
import type { BlockedUserResponse } from "@/lib/types/api";

export interface BlockedUserRowProps {
  blocked: BlockedUserResponse;
}

export function BlockedUserRow({ blocked }: BlockedUserRowProps) {
  const { user } = blocked;

  return (
    <FriendRow
      variant="unblock"
      name={`${user.firstName} ${user.lastName}`}
      subtitle={`@${user.username}`}
      avatarUrl={user.avatarUrl}
      disabled
      onUnblock={() => {}}
    />
  );
}
