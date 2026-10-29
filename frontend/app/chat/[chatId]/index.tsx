import { useCallback } from "react";
import { ActivityIndicator, View } from "react-native";
import { KeyboardStickyView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { ChatHeader } from "@/components/chats/chat-header";
import { Composer } from "@/components/chats/composer";
import { MessageList } from "@/components/chats/message-list";
import { ReadOnlyBar } from "@/components/chats/read-only-bar";
import { FriendActionsMenu } from "@/components/friends/friend-actions-menu";
import { Button } from "@/components/ui/button";
import { NoteCard } from "@/components/ui/note-card";
import { Text } from "@/components/ui/text";
import { useChat } from "@/hooks/useChat";
import { useFriendActionsMenu } from "@/hooks/useFriendActionsMenu";
import { useFriends } from "@/hooks/useFriends";
import { useMarkReadWhileOpen } from "@/hooks/useMarkChatRead";
import { useReadPositionOnOpen } from "@/hooks/useReadPositionOnOpen";
import { useSendMessage } from "@/hooks/useSendMessage";
import { setOpenChatId } from "@/lib/open-chat";
import { AuthErrorCode } from "@/lib/types/api";
import { getErrorMessage, isErrorCode } from "@/lib/utils/error";

export default function ChatScreen() {
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: chat, isPending, error, refetch } = useChat(Number(chatId));
  const readUpTo = useReadPositionOnOpen(Number(chatId));
  useMarkReadWhileOpen(Number(chatId), readUpTo);
  useFocusEffect(
    useCallback(() => {
      setOpenChatId(Number(chatId));
      return () => setOpenChatId(null);
    }, [chatId]),
  );
  const { data: friends } = useFriends();
  const send = useSendMessage(Number(chatId));
  const menu = useFriendActionsMenu();

  const handleMore = () => {
    if (chat?.type !== "DIRECT") {
      return;
    }
    const otherUser = chat.members[0];
    if (!otherUser) {
      return;
    }
    const friend = friends?.find((f) => f.user.id === otherUser.id);
    menu.open({
      user: otherUser,
      isFriend: chat.canSend,
      favorite: friend?.favorite ?? false,
      muted: friend?.muted ?? false,
    });
  };

  const handleOpenInfo = () => {
    router.push({
      pathname: "/chat/[chatId]/info",
      params: { chatId: String(chatId) },
    });
  };

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingBottom: insets.bottom }}
    >
      <ChatHeader
        chat={chat}
        onMore={
          chat?.type === "DIRECT"
            ? handleMore
            : chat?.type === "GROUP"
              ? handleOpenInfo
              : undefined
        }
        onPress={chat?.type === "GROUP" ? handleOpenInfo : undefined}
      />

      {isPending ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      ) : !chat ? (
        <View className="flex-1 items-center justify-center gap-4 px-6">
          {isErrorCode(error, AuthErrorCode.CHAT_NOT_FOUND) ? (
            <NoteCard
              className="self-stretch"
              title="This chat isn't available"
              description="You may have left it, or it no longer exists"
            />
          ) : (
            <>
              <Text className="text-center">
                {getErrorMessage(error, "Couldn't load this chat")}
              </Text>
              <Button onPress={() => refetch()}>
                <Text>Retry</Text>
              </Button>
            </>
          )}
        </View>
      ) : (
        <>
          <MessageList
            chatId={chat.id}
            isGroup={chat.type === "GROUP"}
            readUpTo={readUpTo}
          />
          {chat.canSend ? (
            <KeyboardStickyView offset={{ opened: insets.bottom }}>
              <Composer
                onSend={(text) => send.mutate({ text })}
                onPickPlace={() =>
                  router.push({
                    pathname: "/chat/[chatId]/pick-place",
                    params: { chatId: String(chat.id) },
                  })
                }
              />
            </KeyboardStickyView>
          ) : (
            <ReadOnlyBar
              firstName={chat.members[0]?.firstName ?? ""}
              username={chat.members[0]?.username}
            />
          )}
        </>
      )}

      {menu.person && (
        <FriendActionsMenu
          key={menu.key}
          person={menu.person}
          visible={menu.visible}
          onClose={menu.close}
          onBlocked={() => router.back()}
        />
      )}
    </View>
  );
}
