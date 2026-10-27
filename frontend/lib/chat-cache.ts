import type { QueryClient } from "@tanstack/react-query";
import { chatMessagesQueryOptions } from "@/hooks/useChatMessages";
import { chatsQueryOptions } from "@/hooks/useChats";
import type { ChatMessageResponse } from "@/lib/types/api";

export function addMessageToChatList(
  queryClient: QueryClient,
  chatId: number,
  message: ChatMessageResponse,
) {
  let found = false;
  queryClient.setQueryData(chatsQueryOptions.queryKey, (chats) => {
    const chat = chats?.find((cached) => cached.id === chatId);
    if (!chats || !chat) return chats;
    found = true;
    if (chat.lastMessage && chat.lastMessage.id >= message.id) return chats;

    const others = chats.filter((cached) => cached.id !== chatId);
    return [{ ...chat, lastMessage: message }, ...others];
  });

  if (!found) {
    void queryClient.invalidateQueries({
      queryKey: chatsQueryOptions.queryKey,
      exact: true,
    });
  }
}

export function addMessageToCache(
  queryClient: QueryClient,
  chatId: number,
  message: ChatMessageResponse,
) {
  queryClient.setQueryData(
    chatMessagesQueryOptions(chatId).queryKey,
    (data) => {
      if (!data) return data;
      const exists = data.pages.some((page) =>
        page.some((cached) => cached.id === message.id),
      );
      if (exists) return data;

      const [newest = [], ...older] = data.pages;
      return { ...data, pages: [[message, ...newest], ...older] };
    },
  );
}
