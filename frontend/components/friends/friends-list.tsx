import { useState } from "react";
import { ActivityIndicator, SectionList, View } from "react-native";
import { router } from "expo-router";
import { FriendActionsMenu } from "@/components/friends/friend-actions-menu";
import { FriendRow } from "@/components/friends/friend-row";
import { Button } from "@/components/ui/button";
import { NoteCard } from "@/components/ui/note-card";
import { RefreshControl } from "@/components/ui/refresh-control";
import { SearchField } from "@/components/ui/search-field";
import { SectionLabel } from "@/components/ui/section-label";
import { Text } from "@/components/ui/text";
import { useFriendActionsMenu } from "@/hooks/useFriendActionsMenu";
import { useFriends } from "@/hooks/useFriends";
import { useRefreshByUser } from "@/hooks/useRefreshByUser";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
import { matchesFriendSearch } from "@/lib/friend-search";
import { getProfileHref } from "@/lib/profile-link";
import { getErrorMessage } from "@/lib/utils/error";

export function FriendsList() {
  const { data: friends, isPending, error, refetch } = useFriends();
  useRefreshOnFocus(refetch);
  const { isRefetchingByUser, refetchByUser } = useRefreshByUser(refetch);
  const [query, setQuery] = useState("");
  const menu = useFriendActionsMenu();

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
        renderItem={({ item: { user, favorite, muted } }) => (
          <FriendRow
            variant="actions"
            name={`${user.firstName} ${user.lastName}`}
            subtitle={`@${user.username}`}
            avatarUrl={user.avatarUrl}
            onPress={() => router.push(getProfileHref(user.username))}
            onMore={() => menu.open({ user, isFriend: true, favorite, muted })}
          />
        )}
        renderSectionHeader={({ section }) => (
          <SectionLabel title={section.title} className="pb-2 pt-4" />
        )}
        stickySectionHeadersEnabled={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        refreshControl={
          <RefreshControl
            refreshing={isRefetchingByUser}
            onRefresh={refetchByUser}
            className="bg-action text-secondary"
          />
        }
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

      {menu.person && (
        <FriendActionsMenu
          key={menu.key}
          person={menu.person}
          visible={menu.visible}
          onClose={menu.close}
        />
      )}
    </View>
  );
}

function RowGap() {
  return <View className="h-2" />;
}
