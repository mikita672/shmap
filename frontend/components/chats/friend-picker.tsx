import { useState } from "react";
import { ActivityIndicator, FlatList, ScrollView, View } from "react-native";
import { MemberChip } from "@/components/chats/member-chip";
import { PickerRow } from "@/components/chats/picker-row";
import { Button } from "@/components/ui/button";
import { SearchField } from "@/components/ui/search-field";
import { Text } from "@/components/ui/text";
import { useFriends } from "@/hooks/useFriends";
import { matchesFriendSearch } from "@/lib/friend-search";
import { getErrorMessage } from "@/lib/utils/error";

export interface FriendPickerProps {
  selectedIds: Set<number>;
  onToggle: (friendId: number) => void;
  members?: Set<number>;
}

export function FriendPicker({
  selectedIds,
  onToggle,
  members,
}: FriendPickerProps) {
  const [query, setQuery] = useState("");
  const { data: friends, isPending, error, refetch } = useFriends();

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
        <Text className="text-center text-chat-list-foreground">
          {getErrorMessage(error, "Couldn't load your friends")}
        </Text>
        <Button onPress={() => refetch()}>
          <Text>Retry</Text>
        </Button>
      </View>
    );
  }

  const trimmedQuery = query.trim();
  const filteredFriends = trimmedQuery
    ? friends.filter((friend) => matchesFriendSearch(friend, trimmedQuery))
    : friends;

  const friendMap = new Map(friends.map((friend) => [friend.user.id, friend]));
  const selectedFriends = Array.from(selectedIds)
    .map((id) => friendMap.get(id))
    .filter((friend): friend is NonNullable<typeof friend> => Boolean(friend));

  return (
    <View className="flex-1">
      <SearchField
        className="mx-6 mt-2"
        placeholder="Search friends"
        value={query}
        onChangeText={setQuery}
      />

      {selectedFriends.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerClassName="gap-2 px-6"
          className="shrink-0 pt-3"
        >
          {selectedFriends.map((friend) => (
            <MemberChip
              key={friend.user.id}
              name={friend.user.firstName.trim() || friend.user.username}
              onRemove={() => onToggle(friend.user.id)}
            />
          ))}
        </ScrollView>
      )}

      <View className="flex-row items-center justify-between px-6 pb-2 pt-3">
        <Text className="text-sm font-medium leading-5 tracking-[0.5px] text-secondary">
          Friends · {friends.length}
        </Text>
        {selectedIds.size > 0 && (
          <Text className="text-sm font-medium leading-5 tracking-[0.5px] text-secondary">
            {selectedIds.size} selected
          </Text>
        )}
      </View>

      <FlatList
        data={filteredFriends}
        keyExtractor={(friend) => String(friend.user.id)}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        ItemSeparatorComponent={RowGap}
        contentContainerClassName="px-6 pb-6"
        ListEmptyComponent={
          <Text className="pt-10 text-center text-sm leading-5 text-secondary">
            {friends.length === 0 ? "No friends yet" : "No friends found"}
          </Text>
        }
        renderItem={({ item: friend }) => {
          const isMember = Boolean(members?.has(friend.user.id));
          const isSelected = selectedIds.has(friend.user.id);
          const selected = isMember ? "member" : isSelected ? "on" : "off";
          const name =
            `${friend.user.firstName} ${friend.user.lastName}`.trim();
          const subtitle = isMember
            ? "Already in the group"
            : `@${friend.user.username}`;

          return (
            <PickerRow
              name={name}
              subtitle={subtitle}
              avatarUrl={friend.user.avatarUrl}
              selected={selected}
              onPress={isMember ? undefined : () => onToggle(friend.user.id)}
            />
          );
        }}
      />
    </View>
  );
}

function RowGap() {
  return <View className="h-2" />;
}
