import { useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import { ChatsEmpty } from "@/components/chats/chats-empty";
import { PickerRow } from "@/components/chats/picker-row";
import { Button } from "@/components/ui/button";
import { SearchField } from "@/components/ui/search-field";
import { Text } from "@/components/ui/text";
import { useChats } from "@/hooks/useChats";
import { matchesChatSearch } from "@/lib/chat-search";
import type { ChatSummaryResponse } from "@/lib/types/api";
import { getErrorMessage } from "@/lib/utils/error";

type GroupChatSummary = Extract<ChatSummaryResponse, { type: "GROUP" }>;

export interface GroupPickerProps {
  friendId: number;
  friendName: string;
  selectedId: number | null;
  onSelect: (chatId: number | null) => void;
  onNewGroup: () => void;
}

export function GroupPicker({
  friendId,
  friendName,
  selectedId,
  onSelect,
  onNewGroup,
}: GroupPickerProps) {
  const { data: chats, isPending, error, refetch } = useChats();
  const [query, setQuery] = useState("");

  if (isPending) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!chats) {
    return (
      <View className="flex-1 items-center justify-center gap-4 px-6">
        <Text className="text-center">
          {getErrorMessage(error, "Couldn't load your groups")}
        </Text>
        <Button onPress={() => refetch()}>
          <Text>Retry</Text>
        </Button>
      </View>
    );
  }

  const groups = chats.filter(
    (chat): chat is GroupChatSummary => chat.type === "GROUP",
  );

  if (groups.length === 0) {
    return (
      <ChatsEmpty
        title="No groups yet"
        description={`Create a group with ${friendName} to plan a route together`}
        onAction={onNewGroup}
      />
    );
  }

  const matches = groups.filter((group) => matchesChatSearch(group, query));

  return (
    <View className="flex-1">
      <SearchField
        className="mx-6 mt-2"
        placeholder="Search groups"
        value={query}
        onChangeText={setQuery}
      />

      <Text className="px-11 pb-2 pt-3 text-sm font-medium leading-5 tracking-[0.5px] text-secondary">
        Groups · {groups.length}
      </Text>

      <FlatList
        data={matches}
        keyExtractor={(group) => String(group.id)}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        ItemSeparatorComponent={RowGap}
        ListEmptyComponent={
          <Text className="pt-10 text-center text-sm leading-5 text-secondary">
            No groups found
          </Text>
        }
        contentContainerClassName="px-6 pb-6"
        renderItem={({ item: group }) => {
          const isMember = group.memberIds.includes(friendId);
          const selected = isMember
            ? "member"
            : group.id === selectedId
              ? "on"
              : "off";
          const memberCount = group.memberIds.length + 1;

          return (
            <PickerRow
              group
              name={group.name}
              subtitle={
                isMember ? "Already in the group" : `${memberCount} members`
              }
              selected={selected}
              onPress={
                isMember
                  ? undefined
                  : () => onSelect(group.id === selectedId ? null : group.id)
              }
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
