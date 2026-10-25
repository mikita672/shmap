import { useState } from "react";
import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FriendPicker } from "@/components/chats/friend-picker";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { TitleHeader } from "@/components/ui/title-header";
import { useChat } from "@/hooks/useChat";
import { useAddChatMembers } from "@/hooks/useChatMutations";
import { useProfile } from "@/hooks/useProfile";

export default function AddMembersScreen() {
  const insets = useSafeAreaInsets();
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const numericChatId = Number(chatId);
  const { data: chat } = useChat(numericChatId);
  const { data: me } = useProfile();
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const addMembers = useAddChatMembers();

  const existingMemberIds = new Set<number>();
  if (me?.id) {
    existingMemberIds.add(me.id);
  }
  if (chat?.members) {
    for (const member of chat.members) {
      existingMemberIds.add(member.id);
    }
  }

  const handleToggle = (friendId: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(friendId)) {
        next.delete(friendId);
      } else {
        next.add(friendId);
      }
      return next;
    });
  };

  const handleAdd = () => {
    if (selectedIds.size === 0 || addMembers.isPending) return;
    addMembers.mutate({
      chatId: numericChatId,
      userIds: Array.from(selectedIds),
    });
  };

  const title = "Add to " + (chat?.type === "GROUP" ? chat.name : "chat");

  return (
    <View className="flex-1 bg-background">
      <TitleHeader title={title} />

      <FriendPicker
        selectedIds={selectedIds}
        onToggle={handleToggle}
        members={existingMemberIds}
      />

      <View className="px-6 pt-4" style={{ paddingBottom: insets.bottom + 24 }}>
        <Button
          size="xl"
          disabled={selectedIds.size === 0 || addMembers.isPending}
          onPress={handleAdd}
        >
          <Text className="text-2xl">
            {addMembers.isPending ? "Adding…" : "Add"}
          </Text>
        </Button>
      </View>
    </View>
  );
}
