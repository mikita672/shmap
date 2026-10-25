import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner-native";
import { chatsQueryOptions } from "@/hooks/useChats";
import { sendChatMessage } from "@/lib/api/chats";
import { addMessageToCache } from "@/lib/chat-cache";
import { getErrorMessage } from "@/lib/utils/error";

export function useSendMessage(chatId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["chats", chatId, "send"],
    scope: { id: `chat-${chatId}` },
    mutationFn: async (text: string) => {
      const { data } = await sendChatMessage(chatId, text);
      return data;
    },
    onSuccess: (message) => addMessageToCache(queryClient, chatId, message),
    onError: (error) => {
      toast.error(getErrorMessage(error, "Couldn't send the message"));
    },
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: chatsQueryOptions.queryKey,
        exact: true,
      }),
  });
}
