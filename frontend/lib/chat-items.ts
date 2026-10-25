import { formatDayLabel, isSameDay } from "@/lib/chat-time";
import type { ChatMessageResponse } from "@/lib/types/api";

export type ChatItem =
  | { kind: "message"; key: string; message: ChatMessageResponse }
  | { kind: "day"; key: string; label: string };

export function buildChatItems(
  messages: ChatMessageResponse[],
  now: number,
): ChatItem[] {
  const items: ChatItem[] = [];

  messages.forEach((message, index) => {
    items.push({ kind: "message", key: `message-${message.id}`, message });

    const older = messages[index + 1];
    if (!older || !isSameDay(message.createdAt, older.createdAt)) {
      items.push({
        kind: "day",
        key: `day-${message.id}`,
        label: formatDayLabel(message.createdAt, now),
      });
    }
  });

  return items;
}
