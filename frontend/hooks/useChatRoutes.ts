import { queryOptions, useQuery } from "@tanstack/react-query";
import { getChatRoutes } from "@/lib/api/routes";
import { AuthErrorCode } from "@/lib/types/api";
import { isErrorCode } from "@/lib/utils/error";

export const chatRoutesQueryOptions = (chatId: number) =>
  queryOptions({
    queryKey: ["chats", chatId, "routes"],
    queryFn: async () => {
      const { data } = await getChatRoutes(chatId);
      return data;
    },
    retry: (failureCount, error) =>
      !isErrorCode(error, AuthErrorCode.CHAT_NOT_FOUND) && failureCount < 2,
  });

export function useChatRoutes(chatId: number) {
  return useQuery(chatRoutesQueryOptions(chatId));
}
