import { useState } from "react";
import { ActivityIndicator, SectionList, View } from "react-native";
import { FriendRow } from "@/components/friends/friend-row";
import { Button } from "@/components/ui/button";
import { NoteCard } from "@/components/ui/note-card";
import { SearchField } from "@/components/ui/search-field";
import { SectionLabel } from "@/components/ui/section-label";
import { Text } from "@/components/ui/text";
import { useFriends } from "@/hooks/useFriends";
import { useRefreshByUser } from "@/hooks/useRefreshByUser";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
import { matchesFriendSearch } from "@/lib/friend-search";
import { getErrorMessage } from "@/lib/utils/error";

export function FriendsList() {
  const { data: friends, isPending, error, refetch } = useFriends();
  useRefreshOnFocus(refetch);
  const { isRefetchingByUser, refetchByUser } = useRefreshByUser(refetch);
  const [query, setQuery] = useState("");

  if (isPending) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!friends) {
    return (
      <View className="flex-1 items-center justify-center gap-4 px-6">
        <Text className="text-center">
          {getErrorMessage(error, "Couldn't load your friends")}
        </Text>
        <Button onPress={() => refetch()}>
          <Text>Retry</Text>
        </Button>
      </View>
    );
  }

  const matches = friends.filter((friend) =>
    matchesFriendSearch(friend, query),
  );

  const sections = [
    {
      key: "favorites",
      title: "Favorites",
      data: matches.filter((friend) => friend.favorite),
    },
    {
      key: "all",
      title: `All friends · ${friends.length}`,
      data: matches.filter((friend) => !friend.favorite),
    },
  ].filter((section) => section.data.length > 0);

  return (
    <View className="flex-1">
      <SearchField
        className="mx-6 mt-4"
        placeholder="Search friends"
        value={query}
        onChangeText={setQuery}
      />
      <SectionList
        sections={sections}
        keyExtractor={(friend) => String(friend.user.id)}
        renderItem={({ item: { user } }) => (
          <FriendRow
            variant="actions"
            name={`${user.firstName} ${user.lastName}`}
            subtitle={`@${user.username}`}
            avatarUrl={user.avatarUrl}
            onMore={() => {}}
          />
        )}
        renderSectionHeader={({ section }) => (
          <SectionLabel title={section.title} className="pb-2 pt-4" />
        )}
        stickySectionHeadersEnabled={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        refreshing={isRefetchingByUser}
        onRefresh={refetchByUser}
        ItemSeparatorComponent={RowGap}
        ListEmptyComponent={
          friends.length === 0 ? (
            <NoteCard
              title="No friends yet"
              description="Tap + to find people you know."
              className="mt-4"
            />
          ) : (
            <NoteCard
              title="No friends found"
              description="Try another name or @username."
              className="mt-4"
            />
          )
        }
        contentContainerClassName="px-6 pb-6"
      />
    </View>
  );
}

function RowGap() {
  return <View className="h-2" />;
}
