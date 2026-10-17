import { FriendRow } from "@/components/friends/friend-row";
import { mutualFriendsSubtitle } from "@/lib/mutual-friends";
import type { UserSearchResultResponse } from "@/lib/types/api";

export interface SearchResultRowProps {
  result: UserSearchResultResponse;
}

export function SearchResultRow({ result }: SearchResultRowProps) {
  const { user } = result;
  const row = {
    name: `${user.firstName} ${user.lastName}`,
    subtitle: mutualFriendsSubtitle(result),
    avatarUrl: user.avatarUrl,
  };

  switch (result.relationship) {
    case "NONE":
      return <FriendRow variant="add" {...row} onAdd={() => {}} />;
    case "REQUESTED":
      return (
        <FriendRow
          variant="sent"
          label="Requested"
          {...row}
          onCancel={() => {}}
        />
      );
    case "INCOMING":
      return <FriendRow variant="accept" {...row} onAccept={() => {}} />;
    case "FRIENDS":
      return <FriendRow variant="friends" {...row} />;
    default:
      return result satisfies never;
  }
}
