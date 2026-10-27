import { useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useIsFocused } from "expo-router";
import { chatQueryOptions, useChat } from "@/hooks/useChat";
import { useChatMessages } from "@/hooks/useChatMessages";
import { chatsQueryOptions } from "@/hooks/useChats";
import { unreadChatCountQueryOptions } from "@/hooks/useUnreadChatCount";
import { markChatRead } from "@/lib/api/chats";
import {
  addToUnreadTotal,
  getChatUnreadCount,
  moveReadPosition,
  refetchUnreadTotal,
  setChatUnreadCount,
} from "@/lib/chat-cache";

const LIVE_READ_DELAY_MS = 1000;

export function useMarkChatRead(chatId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["chats", chatId, "read"],
    mutationFn: async (messageId: number) => {
      await markChatRead(chatId, messageId);
    },
    onMutate: async (messageId) => {
      await Promise.all([
        queryClient.cancelQueries({
          queryKey: chatsQueryOptions.queryKey,
          exact: true,
        }),
        queryClient.cancelQueries({
          queryKey: unreadChatCountQueryOptions.queryKey,
          exact: true,
        }),
      ]);
      addToUnreadTotal(queryClient, -getChatUnreadCount(queryClient, chatId));
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
      void refetchUnreadTotal(queryClient);
    },
  });
}

export function useMarkReadWhileOpen(
  chatId: number,
  readUpTo: number | null | undefined,
) {
  const { data, fetchStatus } = useChatMessages(chatId);
  const { data: chat } = useChat(chatId);
  const { mutate } = useMarkChatRead(chatId);
  const isFocused = useIsFocused();
  const hasMarkedRef = useRef(false);
  const failedIdRef = useRef<number | null>(null);
  const newestId = data?.pages[0]?.[0]?.id;
  const lastReadId = chat?.lastReadMessageId ?? null;

  useEffect(() => {
    if (!isFocused || readUpTo === undefined || fetchStatus !== "idle") return;
    if (newestId === undefined || newestId <= (lastReadId ?? 0)) return;
    if (newestId === failedIdRef.current) return;

    const delay = hasMarkedRef.current ? LIVE_READ_DELAY_MS : 0;
    const timer = setTimeout(() => {
      hasMarkedRef.current = true;
      mutate(newestId, {
        onError: () => {
          failedIdRef.current = newestId;
        },
      });
    }, delay);
    return () => clearTimeout(timer);
  }, [isFocused, readUpTo, fetchStatus, newestId, lastReadId, mutate]);
}
