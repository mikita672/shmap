import { FlatList, View } from "react-native";
import { FriendRow } from "@/components/friends/friend-row";
import { NoteCard } from "@/components/ui/note-card";
import { useOpenProfile } from "@/hooks/useOpenProfile";
import type { UserSummaryResponse } from "@/lib/types/api";

export interface UserListProps {
  users: UserSummaryResponse[];
  emptyTitle: string;
  emptyDescription: string;
}

export function UserList({
  users,
  emptyTitle,
  emptyDescription,
}: UserListProps) {
  const openProfile = useOpenProfile();

  return (
    <FlatList
      data={users}
      keyExtractor={(user) => String(user.id)}
      renderItem={({ item: user }) => (
        <FriendRow
          variant="plain"
          name={`${user.firstName} ${user.lastName}`}
          subtitle={`@${user.username}`}
          avatarUrl={user.avatarUrl}
          onPress={() => openProfile(user)}
        />
      )}
      ListEmptyComponent={
        <NoteCard title={emptyTitle} description={emptyDescription} />
      }
      ItemSeparatorComponent={RowGap}
      contentContainerClassName="px-6 pb-6 pt-4"
    />
  );
}

function RowGap() {
  return <View className="h-2" />;
}
