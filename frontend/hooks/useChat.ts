import { queryOptions, useQuery } from "@tanstack/react-query";
import { getChat } from "@/lib/api/chats";
import { AuthErrorCode } from "@/lib/types/api";
import { isErrorCode } from "@/lib/utils/error";

export const chatQueryOptions = (chatId: number) =>
  queryOptions({
    queryKey: ["chats", chatId],
    queryFn: async () => {
      const { data } = await getChat(chatId);
      return data;
    },
    retry: (failureCount, error) =>
      !isErrorCode(error, AuthErrorCode.CHAT_NOT_FOUND) && failureCount < 2,
  });

export function useChat(chatId: number) {
  return useQuery(chatQueryOptions(chatId));
}
