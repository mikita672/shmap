import { FlatList, View } from "react-native";
import { BlockedUserRow } from "@/components/settings/blocked-user-row";
import { NoteCard } from "@/components/ui/note-card";
import { RefreshControl } from "@/components/ui/refresh-control";
import { useRefreshByUser } from "@/hooks/useRefreshByUser";
import type { BlockedUserResponse } from "@/lib/types/api";

export interface BlockedUsersListProps {
  blockedUsers: BlockedUserResponse[];
  onRefresh: () => Promise<unknown>;
}

export function BlockedUsersList({
  blockedUsers,
  onRefresh,
}: BlockedUsersListProps) {
  const { isRefetchingByUser, refetchByUser } = useRefreshByUser(onRefresh);

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
      refreshControl={
        <RefreshControl
          refreshing={isRefetchingByUser}
          onRefresh={refetchByUser}
          className="bg-action text-secondary"
        />
      }
      contentContainerClassName="px-6 pb-6 pt-4"
    />
  );
}

function RowGap() {
  return <View className="h-2" />;
}
