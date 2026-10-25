import { ActivityIndicator, FlatList, View } from "react-native";
import { MessageBubble } from "@/components/chats/message-bubble";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useProfile } from "@/hooks/useProfile";
import { formatMessageTime } from "@/lib/chat-time";
import { getErrorMessage } from "@/lib/utils/error";

export interface MessageListProps {
  chatId: number;
}

export function MessageList({ chatId }: MessageListProps) {
  const { data, isPending, error, refetch } = useChatMessages(chatId);
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

  const messages = data.pages.flat();

  return (
    <FlatList
      inverted
      showsVerticalScrollIndicator={false}
      data={messages}
      keyExtractor={(message) => String(message.id)}
      renderItem={({ item: message }) => (
        <MessageBubble
          text={message.text}
          time={formatMessageTime(message.createdAt)}
          isMine={message.sender.id === me?.id}
        />
      )}
      ItemSeparatorComponent={BubbleGap}
      contentContainerClassName="px-3 py-2"
    />
  );
}

function BubbleGap() {
  return <View className="h-1" />;
}
