import { Pressable, View } from "react-native";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { MessageBubble } from "@/components/chats/message-bubble";
import { PlaceMessageCard } from "@/components/chats/place-message-card";
import { RouteMessage } from "@/components/chats/route-message";
import { Avatar } from "@/components/ui/avatar";
import { formatMessageTime } from "@/lib/chat-time";
import type {
  ChatMessageResponse,
  ChatPlace,
  UserSummaryResponse,
} from "@/lib/types/api";
import { cn } from "@/lib/utils";

const AVATAR_SIZE = 32;

function openPlace(chatId: number, place: ChatPlace) {
  router.push({
    pathname: "/chat/[chatId]/place",
    params: { chatId: String(chatId), place: JSON.stringify(place) },
  });
}

export interface MessageRowProps {
  chatId: number;
  message: ChatMessageResponse;
  isMine: boolean;
  isGroup: boolean;
  isFirstInRun: boolean;
  isLastInRun: boolean;
  onSenderPress?: (sender: UserSummaryResponse) => void;
  onPlaceLongPress?: (place: ChatPlace) => void;
}

export function MessageRow({
  chatId,
  message,
  isMine,
  isGroup,
  isFirstInRun,
  isLastInRun,
  onSenderPress,
  onPlaceLongPress,
}: MessageRowProps) {
  const showAuthor = isGroup && !isMine;
  const { sender } = message;
  const time = formatMessageTime(message.createdAt);
  const senderName =
    showAuthor && isFirstInRun
      ? `${sender.firstName} ${sender.lastName}`
      : undefined;
  const handleSenderPress = onSenderPress
    ? () => onSenderPress(sender)
    : undefined;
  const handlePlaceLongPress =
    message.type === "PLACE" && onPlaceLongPress
      ? () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(
            () => {},
          );
          onPlaceLongPress(message.place);
        }
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
          <Pressable
            onPress={handleSenderPress}
            disabled={!handleSenderPress}
            accessibilityRole="button"
            accessibilityLabel={`Open ${sender.firstName} ${sender.lastName}'s profile`}
            hitSlop={4}
            className="active:opacity-80"
          >
            <Avatar uri={sender.avatarUrl} size={AVATAR_SIZE} tone="surface" />
          </Pressable>
        ) : (
          <View style={{ width: AVATAR_SIZE }} />
        ))}
      {message.type === "ROUTE" ? (
        <RouteMessage
          route={message.route}
          text={message.text}
          time={time}
          isMine={isMine}
          senderName={senderName}
          onSenderPress={handleSenderPress}
        />
      ) : message.type === "PLACE" ? (
        <Pressable
          onPress={() => openPlace(chatId, message.place)}
          onLongPress={handlePlaceLongPress}
          accessibilityRole="button"
          accessibilityHint="Opens the place on the map"
          accessibilityActions={
            handlePlaceLongPress
              ? [
                  { name: "activate" },
                  { name: "addToRoute", label: "Add to route" },
                ]
              : undefined
          }
          onAccessibilityAction={(event) => {
            if (event.nativeEvent.actionName === "addToRoute") {
              handlePlaceLongPress?.();
            } else if (event.nativeEvent.actionName === "activate") {
              openPlace(chatId, message.place);
            }
          }}
          className="active:opacity-80"
        >
          <PlaceMessageCard
            place={message.place}
            time={time}
            isMine={isMine}
            senderName={senderName}
            onSenderPress={handleSenderPress}
          />
        </Pressable>
      ) : (
        <MessageBubble
          text={message.text}
          time={time}
          isMine={isMine}
          senderName={senderName}
          onSenderPress={handleSenderPress}
        />
      )}
    </View>
  );
}
