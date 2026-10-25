import { ActivityIndicator, View } from "react-native";
import { KeyboardStickyView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { ChatHeader } from "@/components/chats/chat-header";
import { Composer } from "@/components/chats/composer";
import { MessageList } from "@/components/chats/message-list";
import { ReadOnlyBar } from "@/components/chats/read-only-bar";
import { Button } from "@/components/ui/button";
import { NoteCard } from "@/components/ui/note-card";
import { Text } from "@/components/ui/text";
import { useChat } from "@/hooks/useChat";
import { useSendMessage } from "@/hooks/useSendMessage";
import { AuthErrorCode } from "@/lib/types/api";
import { getErrorMessage, isErrorCode } from "@/lib/utils/error";

export default function ChatScreen() {
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const insets = useSafeAreaInsets();
  const { data: chat, isPending, error, refetch } = useChat(Number(chatId));
  const send = useSendMessage(Number(chatId));

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingBottom: insets.bottom }}
    >
      <ChatHeader chat={chat} />

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
          <MessageList chatId={chat.id} isGroup={chat.type === "GROUP"} />
          {chat.canSend ? (
            <KeyboardStickyView offset={{ opened: insets.bottom }}>
              <Composer onSend={(text) => send.mutate(text)} />
            </KeyboardStickyView>
          ) : (
            <ReadOnlyBar firstName={chat.members[0]?.firstName ?? ""} />
          )}
        </>
      )}
    </View>
  );
}
