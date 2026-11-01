import { useState } from "react";
import { ActivityIndicator, SectionList, View } from "react-native";
import { ChatsEmpty } from "@/components/chats/chats-empty";
import { PickerRow } from "@/components/chats/picker-row";
import { Button } from "@/components/ui/button";
import { SearchField } from "@/components/ui/search-field";
import { Text } from "@/components/ui/text";
import { useChats } from "@/hooks/useChats";
import { useFriends } from "@/hooks/useFriends";
import { matchesChatSearch } from "@/lib/chat-search";
import { matchesFriendSearch } from "@/lib/friend-search";
import { sendTargetKey, type SendTarget } from "@/lib/send-target";
import type { ChatSummaryResponse } from "@/lib/types/api";
import { getErrorMessage } from "@/lib/utils/error";

type GroupChatSummary = Extract<ChatSummaryResponse, { type: "GROUP" }>;

interface TargetRow {
  target: SendTarget;
  name: string;
  subtitle: string;
  avatarUrl?: string | null;
}

export interface SendTargetPickerProps {
  selectedKeys: Set<string>;
  onToggle: (target: SendTarget) => void;
  onAddFriends: () => void;
}

export function SendTargetPicker({
  selectedKeys,
  onToggle,
  onAddFriends,
}: SendTargetPickerProps) {
  const [query, setQuery] = useState("");
  const chats = useChats();
  const friends = useFriends();

  if (chats.isPending || friends.isPending) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!chats.data || !friends.data) {
    return (
      <View className="flex-1 items-center justify-center gap-4 px-6">
        <Text className="text-center">
          {getErrorMessage(
            chats.error ?? friends.error,
            "Couldn't load your chats",
          )}
        </Text>
        <Button
          onPress={() => {
            chats.refetch();
            friends.refetch();
          }}
        >
          <Text>Retry</Text>
        </Button>
      </View>
    );
  }

  const groups: TargetRow[] = chats.data
    .filter((chat): chat is GroupChatSummary => chat.type === "GROUP")
    .filter((chat) => matchesChatSearch(chat, query))
    .map((chat) => ({
      target: { kind: "group", chatId: chat.id },
      name: chat.name,
      subtitle: `${chat.memberIds.length + 1} members`,
    }));

  const friendRows: TargetRow[] = friends.data
    .filter((friend) => matchesFriendSearch(friend, query))
    .map((friend) => ({
      target: { kind: "friend", userId: friend.user.id },
      name: `${friend.user.firstName} ${friend.user.lastName}`.trim(),
      subtitle: `@${friend.user.username}`,
      avatarUrl: friend.user.avatarUrl,
    }));

  const hasAnyone =
    friends.data.length > 0 || chats.data.some((chat) => chat.type === "GROUP");

  if (!hasAnyone) {
    return (
      <ChatsEmpty
        title="No one to send to yet"
        description="Add friends to share places with them"
        actionLabel="Add friends"
        actionIcon="person-add"
        onAction={onAddFriends}
      />
    );
  }

  const sections = [
    { title: "Groups", data: groups },
    { title: "Friends", data: friendRows },
  ].filter((section) => section.data.length > 0);

  return (
    <View className="flex-1">
      <SearchField
        className="mx-6 mt-4"
        placeholder="Search friends and groups"
        value={query}
        onChangeText={setQuery}
      />

      <SectionList
        sections={sections}
        keyExtractor={(row) => sendTargetKey(row.target)}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        stickySectionHeadersEnabled={false}
        ItemSeparatorComponent={RowGap}
        contentContainerClassName="px-6 pb-6"
        renderSectionHeader={({ section }) => (
          <Text className="px-5 pb-2 pt-4 text-sm font-medium leading-5 tracking-[0.5px] text-secondary">
            {section.title}
          </Text>
        )}
        ListEmptyComponent={
          <Text className="pt-10 text-center text-sm leading-5 text-secondary">
            No friends or groups found
          </Text>
        }
        renderItem={({ item: row }) => (
          <PickerRow
            group={row.target.kind === "group"}
            name={row.name}
            subtitle={row.subtitle}
            avatarUrl={row.avatarUrl}
            selected={
              selectedKeys.has(sendTargetKey(row.target)) ? "on" : "off"
            }
            onPress={() => onToggle(row.target)}
          />
        )}
      />
    </View>
  );
}

function RowGap() {
  return <View className="h-2" />;
}
