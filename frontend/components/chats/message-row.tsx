import { View } from "react-native";
import { MessageBubble } from "@/components/chats/message-bubble";
import { PlaceMessageCard } from "@/components/chats/place-message-card";
import { Avatar } from "@/components/ui/avatar";
import { formatMessageTime } from "@/lib/chat-time";
import type { ChatMessageResponse } from "@/lib/types/api";
import { cn } from "@/lib/utils";

const AVATAR_SIZE = 32;

export interface MessageRowProps {
  message: ChatMessageResponse;
  isMine: boolean;
  isGroup: boolean;
  isFirstInRun: boolean;
  isLastInRun: boolean;
}

export function MessageRow({
  message,
  isMine,
  isGroup,
  isFirstInRun,
  isLastInRun,
}: MessageRowProps) {
  const showAuthor = isGroup && !isMine;
  const { sender } = message;
  const time = formatMessageTime(message.createdAt);
  const senderName =
    showAuthor && isFirstInRun
      ? `${sender.firstName} ${sender.lastName}`
      : undefined;

  return (
    <View
      className={cn(
        "flex-row items-end gap-2",
        isMine ? "justify-end" : "justify-start",
        isFirstInRun ? "pt-2.5" : "pt-1",
      )}
    >
      {showAuthor &&
        (isLastInRun ? (
          <Avatar uri={sender.avatarUrl} size={AVATAR_SIZE} tone="surface" />
        ) : (
          <View style={{ width: AVATAR_SIZE }} />
        ))}
      {message.type === "PLACE" ? (
        <PlaceMessageCard
          place={message.place}
          time={time}
          isMine={isMine}
          senderName={senderName}
        />
      ) : (
        <MessageBubble
          text={message.text}
          time={time}
          isMine={isMine}
          senderName={senderName}
        />
      )}
    </View>
  );
}
