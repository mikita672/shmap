import { useState } from "react";
import { useChat } from "@/hooks/useChat";

export function useReadPositionOnOpen(chatId: number) {
  const { data: chat, fetchStatus } = useChat(chatId);
  const [readUpTo, setReadUpTo] = useState<number | null | undefined>(
    undefined,
  );

  if (readUpTo === undefined && chat && fetchStatus === "idle") {
    setReadUpTo(chat.lastReadMessageId);
  }

  return readUpTo;
}
