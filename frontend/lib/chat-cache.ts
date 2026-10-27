import type { QueryClient } from "@tanstack/react-query";
import { chatQueryOptions } from "@/hooks/useChat";
import { chatMessagesQueryOptions } from "@/hooks/useChatMessages";
import { chatsQueryOptions } from "@/hooks/useChats";
import { unreadChatCountQueryOptions } from "@/hooks/useUnreadChatCount";
import type {
  ChatMessageResponse,
  ChatReadEvent,
  ChatResponse,
} from "@/lib/types/api";

export function getChatUnreadCount(queryClient: QueryClient, chatId: number) {
  return (
    queryClient
      .getQueryData(chatsQueryOptions.queryKey)
      ?.find((chat) => chat.id === chatId)?.unreadCount ?? 0
  );
}

export function setChatUnreadCount(
  queryClient: QueryClient,
  chatId: number,
  unreadCount: number,
) {
  queryClient.setQueryData(chatsQueryOptions.queryKey, (chats) =>
    chats?.map((chat) =>
      chat.id === chatId ? { ...chat, unreadCount } : chat,
    ),
  );
}

export function setUnreadTotal(queryClient: QueryClient, count: number) {
  queryClient.setQueryData(unreadChatCountQueryOptions.queryKey, count);
}

export function addToUnreadTotal(queryClient: QueryClient, delta: number) {
  queryClient.setQueryData(unreadChatCountQueryOptions.queryKey, (count) =>
    count === undefined ? count : Math.max(0, count + delta),
  );
}

export function refetchUnreadTotal(queryClient: QueryClient) {
  return queryClient.invalidateQueries({
    queryKey: unreadChatCountQueryOptions.queryKey,
    exact: true,
  });
}

export function moveReadPosition(
  queryClient: QueryClient,
  chatId: number,
  messageId: number,
) {
  queryClient.setQueryData(
    chatQueryOptions(chatId).queryKey,
    (chat?: ChatResponse) => {
      if (!chat) return chat;
      if ((chat.lastReadMessageId ?? 0) >= messageId) return chat;
      return { ...chat, lastReadMessageId: messageId };
    },
  );
}

export function applyChatRead(queryClient: QueryClient, event: ChatReadEvent) {
  setChatUnreadCount(queryClient, event.chatId, event.unreadCount);
  moveReadPosition(queryClient, event.chatId, event.lastReadMessageId);
  setUnreadTotal(queryClient, event.totalUnreadCount);
}

export function addMessageToChatList(
  queryClient: QueryClient,
  chatId: number,
  message: ChatMessageResponse,
  countAsUnread = false,
) {
  let found = false;
  let isNew = true;
  queryClient.setQueryData(chatsQueryOptions.queryKey, (chats) => {
    const chat = chats?.find((cached) => cached.id === chatId);
    if (!chats || !chat) return chats;
    found = true;
    if (chat.lastMessage && chat.lastMessage.id >= message.id) {
      isNew = false;
      return chats;
    }

    const unreadCount = chat.unreadCount + (countAsUnread ? 1 : 0);
    const others = chats.filter((cached) => cached.id !== chatId);
    return [{ ...chat, lastMessage: message, unreadCount }, ...others];
  });

  if (countAsUnread && isNew) {
    addToUnreadTotal(queryClient, 1);
  }

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
