import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  View,
  type GestureResponderEvent,
  type ScrollViewProps,
} from "react-native";
import {
  KeyboardChatScrollView,
  KeyboardController,
} from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DayChip } from "@/components/chats/day-chip";
import { MessageBubble } from "@/components/chats/message-bubble";
import { MessageRow } from "@/components/chats/message-row";
import { PlaceMessageCard } from "@/components/chats/place-message-card";
import { UnreadDivider } from "@/components/chats/unread-divider";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useProfile } from "@/hooks/useProfile";
import { useOutgoingMessages } from "@/hooks/useSendMessage";
import {
  buildChatItems,
  findFirstUnreadId,
  type ChatItem,
} from "@/lib/chat-items";
import { getErrorMessage } from "@/lib/utils/error";

const MAX_SCROLL_RETRIES = 3;
const TAP_SLOP = 10;

export interface MessageListProps {
  chatId: number;
  isGroup: boolean;
  readUpTo?: number | null;
}

export function MessageList({ chatId, isGroup, readUpTo }: MessageListProps) {
  const {
    data,
    isPending,
    error,
    refetch,
    dataUpdatedAt,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    fetchStatus,
  } = useChatMessages(chatId);
  const { data: me } = useProfile();
  const { outgoing, retry } = useOutgoingMessages(chatId);
  const listRef = useRef<FlatList<ChatItem>>(null);
  const hasDecidedScrollRef = useRef(false);
  const scrollRetriesRef = useRef(0);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: GestureResponderEvent) => {
    touchStartRef.current = {
      x: e.nativeEvent.pageX,
      y: e.nativeEvent.pageY,
    };
  };

  const handleTouchEnd = (e: GestureResponderEvent) => {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (!start) return;
    const moved = Math.hypot(
      e.nativeEvent.pageX - start.x,
      e.nativeEvent.pageY - start.y,
    );
    if (moved <= TAP_SLOP) KeyboardController.dismiss();
  };

  const [newestAtOpen, setNewestAtOpen] = useState<number | undefined>(
    undefined,
  );

  const messages = data?.pages.flat() ?? [];
  const canDecideScroll =
    readUpTo !== undefined && !!me && !!data && fetchStatus === "idle";
  if (newestAtOpen === undefined && canDecideScroll) {
    setNewestAtOpen(messages[0]?.id ?? 0);
  }

  const firstUnreadId =
    readUpTo === undefined || newestAtOpen === undefined || !me
      ? null
      : findFirstUnreadId(messages, readUpTo, newestAtOpen, me.id, hasNextPage);
  const items = buildChatItems(
    messages,
    dataUpdatedAt,
    outgoing,
    firstUnreadId,
  );
  const unreadIndex = items.findIndex((item) => item.kind === "unread");

  useEffect(() => {
    if (hasDecidedScrollRef.current || !canDecideScroll) return;
    hasDecidedScrollRef.current = true;
    if (unreadIndex < 0) return;

    requestAnimationFrame(() => {
      listRef.current?.scrollToIndex({
        index: unreadIndex,
        viewPosition: 1,
        animated: false,
      });
    });
  }, [canDecideScroll, unreadIndex]);

  const handleScrollToIndexFailed = ({
    index,
    averageItemLength,
  }: {
    index: number;
    averageItemLength: number;
  }) => {
    if (scrollRetriesRef.current >= MAX_SCROLL_RETRIES) return;
    scrollRetriesRef.current += 1;
    listRef.current?.scrollToOffset({
      offset: averageItemLength * index,
      animated: false,
    });
    setTimeout(() => {
      listRef.current?.scrollToIndex({
        index,
        viewPosition: 1,
        animated: false,
      });
    }, 50);
  };

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

  return (
    <FlatList
      ref={listRef}
      inverted
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      initialNumToRender={items.length}
      onScrollToIndexFailed={handleScrollToIndexFailed}
      maintainVisibleContentPosition={{ minIndexForVisible: 1 }}
      showsVerticalScrollIndicator={false}
      renderScrollComponent={(props) => <ChatScrollView {...props} />}
      data={items}
      keyExtractor={(item) => item.key}
      renderItem={({ item }) =>
        item.kind === "day" ? (
          <DayChip label={item.label} />
        ) : item.kind === "unread" ? (
          <UnreadDivider />
        ) : item.kind === "outgoing" ? (
          <Pressable
            className="flex-row justify-end pt-1"
            disabled={!item.message.failed}
            accessibilityRole={item.message.failed ? "button" : undefined}
            accessibilityHint={
              item.message.failed ? "Sends the message again" : undefined
            }
            onPress={() => retry(item.message)}
          >
            {"place" in item.message.content ? (
              <PlaceMessageCard
                place={item.message.content.place}
                isMine
                isPending={!item.message.failed}
                isFailed={item.message.failed}
              />
            ) : (
              <MessageBubble
                text={item.message.content.text}
                isMine
                isPending={!item.message.failed}
                isFailed={item.message.failed}
              />
            )}
          </Pressable>
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
      keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
      automaticallyAdjustContentInsets={false}
      contentInsetAdjustmentBehavior="never"
    />
  );
}
