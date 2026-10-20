import { FlatList, View } from "react-native";
import { BlockedUserRow } from "@/components/settings/blocked-user-row";
import { NoteCard } from "@/components/ui/note-card";
import type { BlockedUserResponse } from "@/lib/types/api";

export interface BlockedUsersListProps {
  blockedUsers: BlockedUserResponse[];
}

export function BlockedUsersList({ blockedUsers }: BlockedUsersListProps) {
  return (
    <FlatList
      data={blockedUsers}
      keyExtractor={({ user }) => String(user.id)}
      renderItem={({ item }) => <BlockedUserRow blocked={item} />}
      ListEmptyComponent={
        <NoteCard
          title="No blocked users"
          description="People you block will show up here"
        />
      }
      ItemSeparatorComponent={RowGap}
      contentContainerClassName="px-6 pb-6 pt-4"
    />
  );
}

function RowGap() {
  return <View className="h-2" />;
}
