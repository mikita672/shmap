import { useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chatQueryOptions } from "@/hooks/useChat";
import { useChatMessages } from "@/hooks/useChatMessages";
import { chatsQueryOptions } from "@/hooks/useChats";
import { markChatRead } from "@/lib/api/chats";
import { moveReadPosition, setChatUnreadCount } from "@/lib/chat-cache";

export function useMarkChatRead(chatId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["chats", chatId, "read"],
    mutationFn: async (messageId: number) => {
      await markChatRead(chatId, messageId);
    },
    onMutate: async (messageId) => {
      await queryClient.cancelQueries({
        queryKey: chatsQueryOptions.queryKey,
        exact: true,
      });
      setChatUnreadCount(queryClient, chatId, 0);
      moveReadPosition(queryClient, chatId, messageId);
    },
    onError: () => {
      void queryClient.invalidateQueries({
        queryKey: chatsQueryOptions.queryKey,
        exact: true,
      });
      void queryClient.invalidateQueries({
        queryKey: chatQueryOptions(chatId).queryKey,
        exact: true,
      });
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
