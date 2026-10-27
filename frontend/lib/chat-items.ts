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
  | { kind: "unread"; key: string }
  | { kind: "outgoing"; key: string; message: OutgoingMessage };

export interface OutgoingMessage {
  submittedAt: number;
  text: string;
  failed: boolean;
}

function isSameRun(a: ChatMessageResponse, b: ChatMessageResponse) {
  return a.sender.id === b.sender.id && isSameDay(a.createdAt, b.createdAt);
}

export function findFirstUnreadId(
  messages: ChatMessageResponse[],
  readUpTo: number | null,
  newestAtOpen: number,
  myId: number,
  hasOlderMessages: boolean,
): number | null {
  let firstUnreadIndex = -1;
  messages.forEach((message, index) => {
    const wasUnreadAtOpen =
      message.id > (readUpTo ?? 0) && message.id <= newestAtOpen;
    if (message.sender.id !== myId && wasUnreadAtOpen) {
      firstUnreadIndex = index;
    }
  });

  if (firstUnreadIndex === -1) return null;
  const isOldestLoaded = firstUnreadIndex === messages.length - 1;
  if (isOldestLoaded && hasOlderMessages) return null;
  return messages[firstUnreadIndex].id;
}

export function buildChatItems(
  messages: ChatMessageResponse[],
  now: number,
  outgoing: OutgoingMessage[] = [],
  firstUnreadId: number | null = null,
): ChatItem[] {
  const items: ChatItem[] = [...outgoing]
    .sort((a, b) => b.submittedAt - a.submittedAt)
    .map((message) => ({
      kind: "outgoing",
      key: `outgoing-${message.submittedAt}`,
      message,
    }));

  messages.forEach((message, index) => {
    const newer = messages[index - 1];
    const older = messages[index + 1];
    const isFirstUnread = message.id === firstUnreadId;

    items.push({
      kind: "message",
      key: `message-${message.id}`,
      message,
      isFirstInRun: isFirstUnread || !older || !isSameRun(message, older),
      isLastInRun:
        !newer || newer.id === firstUnreadId || !isSameRun(message, newer),
    });

    if (isFirstUnread) {
      items.push({ kind: "unread", key: "unread" });
    }

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
