import { formatDayLabel, isSameDay } from "@/lib/chat-time";
import type { ChatMessageResponse } from "@/lib/types/api";

export type ChatItem =
  | {
      kind: "message";
      key: string;
      message: ChatMessageResponse;
      isFirstInRun: boolean;
      isLastInRun: boolean;
    }
  | { kind: "day"; key: string; label: string }
  | { kind: "pending"; key: string; text: string };

export interface PendingMessage {
  submittedAt: number;
  text: string;
}

function isSameRun(a: ChatMessageResponse, b: ChatMessageResponse) {
  return a.sender.id === b.sender.id && isSameDay(a.createdAt, b.createdAt);
}

export function buildChatItems(
  messages: ChatMessageResponse[],
  now: number,
  pending: PendingMessage[] = [],
): ChatItem[] {
  const items: ChatItem[] = [...pending]
    .sort((a, b) => b.submittedAt - a.submittedAt)
    .map((message) => ({
      kind: "pending",
      key: `pending-${message.submittedAt}`,
      text: message.text,
    }));

  messages.forEach((message, index) => {
    const newer = messages[index - 1];
    const older = messages[index + 1];

    items.push({
      kind: "message",
      key: `message-${message.id}`,
      message,
      isFirstInRun: !older || !isSameRun(message, older),
      isLastInRun: !newer || !isSameRun(message, newer),
    });

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
