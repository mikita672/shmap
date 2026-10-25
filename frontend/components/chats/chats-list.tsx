import { ActivityIndicator, FlatList, View } from "react-native";
import { ChatRow } from "@/components/chats/chat-row";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useChats } from "@/hooks/useChats";
import { useProfile } from "@/hooks/useProfile";
import { getChatName, getChatPreview } from "@/lib/chat-preview";
import { formatChatListTime } from "@/lib/chat-time";
import { getErrorMessage } from "@/lib/utils/error";

export function ChatsList() {
  const { data: chats, isPending, error, refetch, dataUpdatedAt } = useChats();
  const { data: me } = useProfile();

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
        <Text className="text-center text-chat-list-foreground">
          {getErrorMessage(error, "Couldn't load your chats")}
        </Text>
        <Button onPress={() => refetch()}>
          <Text>Retry</Text>
        </Button>
      </View>
    );
  }

  return (
    <FlatList
      data={chats}
      keyExtractor={(chat) => String(chat.id)}
      renderItem={({ item: chat, index }) => (
        <ChatRow
          name={getChatName(chat)}
          preview={getChatPreview(chat, me?.id)}
          time={
            chat.lastMessage
              ? formatChatListTime(chat.lastMessage.createdAt, dataUpdatedAt)
              : undefined
          }
          isGroup={chat.type === "GROUP"}
          avatarUrl={chat.type === "DIRECT" ? chat.otherUser.avatarUrl : null}
          divider={index < chats.length - 1}
        />
      )}
    />
  );
}
