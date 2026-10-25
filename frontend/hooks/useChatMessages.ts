import { infiniteQueryOptions, useInfiniteQuery } from "@tanstack/react-query";
import { getChatMessages } from "@/lib/api/chats";

export const CHAT_MESSAGES_PAGE_SIZE = 30;

export const chatMessagesQueryOptions = (chatId: number) =>
  infiniteQueryOptions({
    queryKey: ["chats", chatId, "messages"],
    queryFn: async ({ pageParam }) => {
      const { data } = await getChatMessages(chatId, pageParam);
      return data;
    },
    initialPageParam: null as number | null,
    getNextPageParam: (lastPage) =>
      lastPage.length < CHAT_MESSAGES_PAGE_SIZE ? null : lastPage.at(-1)!.id,
  });

export function useChatMessages(chatId: number) {
  return useInfiniteQuery(chatMessagesQueryOptions(chatId));
}
