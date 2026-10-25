import {
  ActivityIndicator,
  FlatList,
  View,
  type ScrollViewProps,
} from "react-native";
import { KeyboardChatScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DayChip } from "@/components/chats/day-chip";
import { MessageBubble } from "@/components/chats/message-bubble";
import { MessageRow } from "@/components/chats/message-row";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useMutationState } from "@tanstack/react-query";
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
  const pending = useMutationState({
    filters: { mutationKey: ["chats", chatId, "send"], status: "pending" },
    select: (mutation) => ({
      submittedAt: mutation.state.submittedAt,
      text: String(mutation.state.variables),
    }),
  });

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

  const items = buildChatItems(data.pages.flat(), dataUpdatedAt, pending);

  return (
    <FlatList
      inverted
      showsVerticalScrollIndicator={false}
      renderScrollComponent={(props) => <ChatScrollView {...props} />}
      data={items}
      keyExtractor={(item) => item.key}
      renderItem={({ item }) =>
        item.kind === "day" ? (
          <DayChip label={item.label} />
        ) : item.kind === "pending" ? (
          <View className="flex-row justify-end pt-1">
            <MessageBubble text={item.text} isMine isPending />
          </View>
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

function ChatScrollView(props: ScrollViewProps) {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardChatScrollView
      {...props}
      inverted
      offset={insets.bottom}
      keyboardDismissMode="interactive"
      automaticallyAdjustContentInsets={false}
      contentInsetAdjustmentBehavior="never"
    />
  );
}
