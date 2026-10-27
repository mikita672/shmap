import { useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useChatMessages } from "@/hooks/useChatMessages";
import { markChatRead } from "@/lib/api/chats";

export function useMarkChatRead(chatId: number) {
  return useMutation({
    mutationKey: ["chats", chatId, "read"],
    mutationFn: async (messageId: number) => {
      await markChatRead(chatId, messageId);
    },
  });
}

export function useMarkReadOnOpen(
  chatId: number,
  readUpTo: number | null | undefined,
) {
  const { data, fetchStatus } = useChatMessages(chatId);
  const { mutate } = useMarkChatRead(chatId);
  const hasMarkedRef = useRef(false);
  const newestId = data?.pages[0]?.[0]?.id;

  useEffect(() => {
    if (hasMarkedRef.current) return;
    if (readUpTo === undefined || fetchStatus !== "idle") return;
    if (newestId === undefined) return;

    hasMarkedRef.current = true;
    if (newestId > (readUpTo ?? 0)) {
      mutate(newestId);
    }
  }, [readUpTo, fetchStatus, newestId, mutate]);
}
