import { ActivityIndicator, FlatList, View } from "react-native";
import { DayChip } from "@/components/chats/day-chip";
import { MessageRow } from "@/components/chats/message-row";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useProfile } from "@/hooks/useProfile";
import { buildChatItems } from "@/lib/chat-items";
import { getErrorMessage } from "@/lib/utils/error";

export interface MessageListProps {
  chatId: number;
  isGroup: boolean;
}

export function MessageList({ chatId, isGroup }: MessageListProps) {
  const {
    data,
    isPending,
    error,
    refetch,
    dataUpdatedAt,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useChatMessages(chatId);
  const { data: me } = useProfile();

  if (isPending) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!data) {
    return (
      <View className="flex-1 items-center justify-center gap-4 px-6">
        <Text className="text-center">
          {getErrorMessage(error, "Couldn't load messages")}
        </Text>
        <Button onPress={() => refetch()}>
          <Text>Retry</Text>
        </Button>
      </View>
    );
  }

  const items = buildChatItems(data.pages.flat(), dataUpdatedAt);

  return (
    <FlatList
      inverted
      showsVerticalScrollIndicator={false}
      data={items}
      keyExtractor={(item) => item.key}
      renderItem={({ item }) =>
        item.kind === "day" ? (
          <DayChip label={item.label} />
        ) : (
          <MessageRow
            message={item.message}
            isMine={item.message.sender.id === me?.id}
            isGroup={isGroup}
            isFirstInRun={item.isFirstInRun}
            isLastInRun={item.isLastInRun}
          />
        )
      }
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) fetchNextPage();
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isFetchingNextPage ? <ActivityIndicator className="py-3" /> : null
      }
      contentContainerClassName="px-3 py-2"
    />
  );
}
