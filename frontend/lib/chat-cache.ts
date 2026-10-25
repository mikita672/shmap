import type { QueryClient } from "@tanstack/react-query";
import { chatMessagesQueryOptions } from "@/hooks/useChatMessages";
import type { ChatMessageResponse } from "@/lib/types/api";

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
