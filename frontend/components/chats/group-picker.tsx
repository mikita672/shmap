import { ActivityIndicator, FlatList, View } from "react-native";
import { PickerRow } from "@/components/chats/picker-row";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useChats } from "@/hooks/useChats";
import type { ChatSummaryResponse } from "@/lib/types/api";
import { getErrorMessage } from "@/lib/utils/error";

type GroupChatSummary = Extract<ChatSummaryResponse, { type: "GROUP" }>;

export interface GroupPickerProps {
  friendId: number;
  selectedId: number | null;
  onSelect: (chatId: number | null) => void;
}

export function GroupPicker({
  friendId,
  selectedId,
  onSelect,
}: GroupPickerProps) {
  const { data: chats, isPending, error, refetch } = useChats();

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

  return (
    <View className="flex-1">
      <Text className="px-11 pb-2 pt-3 text-sm font-medium leading-5 tracking-[0.5px] text-secondary">
        Groups · {groups.length}
      </Text>

      <FlatList
        data={groups}
        keyExtractor={(group) => String(group.id)}
        ItemSeparatorComponent={RowGap}
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
