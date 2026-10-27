import { ActivityIndicator, FlatList, View } from "react-native";
import { router } from "expo-router";
import { ChatRow } from "@/components/chats/chat-row";
import { ChatsEmpty } from "@/components/chats/chats-empty";
import { Button } from "@/components/ui/button";
import { RefreshControl } from "@/components/ui/refresh-control";
import { Text } from "@/components/ui/text";
import { useChats } from "@/hooks/useChats";
import { useProfile } from "@/hooks/useProfile";
import { useRefreshByUser } from "@/hooks/useRefreshByUser";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
import { useUnreadChatCount } from "@/hooks/useUnreadChatCount";
import { getChatName, getChatPreview } from "@/lib/chat-preview";
import { matchesChatSearch } from "@/lib/chat-search";
import { formatChatListTime } from "@/lib/chat-time";
import { getErrorMessage } from "@/lib/utils/error";

export interface ChatsListProps {
  searchQuery: string;
}

export function ChatsList({ searchQuery }: ChatsListProps) {
  const { data: chats, isPending, error, refetch, dataUpdatedAt } = useChats();
  const { data: me } = useProfile();
  const { refetch: refetchUnreadTotal } = useUnreadChatCount();
  const refetchAll = () => Promise.all([refetch(), refetchUnreadTotal()]);
  useRefreshOnFocus(refetchAll);
  const { isRefetchingByUser, refetchByUser } = useRefreshByUser(refetchAll);

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

  if (chats.length === 0) {
    return <ChatsEmpty onNewGroup={() => router.push("/new-group")} />;
  }

  const matches = chats.filter((chat) => matchesChatSearch(chat, searchQuery));

  return (
    <FlatList
      data={matches}
      keyExtractor={(chat) => String(chat.id)}
      refreshControl={
        <RefreshControl
          refreshing={isRefetchingByUser}
          onRefresh={refetchByUser}
          className="bg-action text-secondary"
        />
      }
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      ListEmptyComponent={
        <Text className="px-6 pt-10 text-center text-sm leading-5 text-secondary">
          No chats found
        </Text>
      }
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
          unreadCount={chat.unreadCount}
          divider={index < matches.length - 1}
          onPress={() =>
            router.push({
              pathname: "/chat/[chatId]",
              params: { chatId: String(chat.id) },
            })
          }
        />
      )}
    />
  );
}
