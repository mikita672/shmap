import {
  useMutation,
  useMutationState,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner-native";
import { chatQueryOptions } from "@/hooks/useChat";
import { sendChatMessage } from "@/lib/api/chats";
import { addMessageToCache, addMessageToChatList } from "@/lib/chat-cache";
import type { OutgoingMessage } from "@/lib/chat-items";
import { AuthErrorCode } from "@/lib/types/api";
import { getErrorMessage, isErrorCode } from "@/lib/utils/error";

const sendMutationKey = (chatId: number) => ["chats", chatId, "send"];

export function useSendMessage(chatId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: sendMutationKey(chatId),
    scope: { id: `chat-${chatId}` },
    gcTime: 24 * 60 * 60 * 1000,
    mutationFn: async (text: string) => {
      const { data } = await sendChatMessage(chatId, text);
      return data;
    },
    onSuccess: (message) => {
      addMessageToCache(queryClient, chatId, message);
      addMessageToChatList(queryClient, chatId, message);
    },
    onError: (error) => {
      if (!isErrorCode(error, AuthErrorCode.NOT_FRIENDS)) return;
      queueMicrotask(() => {
        const mutationCache = queryClient.getMutationCache();
        const failed = mutationCache
          .findAll({ mutationKey: sendMutationKey(chatId) })
          .find((mutation) => mutation.state.error === error);
        if (failed) mutationCache.remove(failed);
      });
      toast.error(getErrorMessage(error, "You can only message friends"));
      return queryClient.invalidateQueries({
        queryKey: chatQueryOptions(chatId).queryKey,
        exact: true,
      });
    },
  });
}

export function useOutgoingMessages(chatId: number) {
  const queryClient = useQueryClient();
  const send = useSendMessage(chatId);

  const outgoing: OutgoingMessage[] = useMutationState({
    filters: {
      mutationKey: sendMutationKey(chatId),
      predicate: ({ state }) =>
        state.status === "pending" ||
        (state.status === "error" &&
          !isErrorCode(state.error, AuthErrorCode.NOT_FRIENDS)),
    },
    select: ({ state }) => ({
      submittedAt: state.submittedAt,
      text: String(state.variables),
      failed: state.status === "error",
    }),
  });

  const retry = (message: OutgoingMessage) => {
    const mutationCache = queryClient.getMutationCache();
    const failed = mutationCache
      .findAll({ mutationKey: sendMutationKey(chatId), status: "error" })
      .find((mutation) => mutation.state.submittedAt === message.submittedAt);
    if (failed) mutationCache.remove(failed);
    send.mutate(message.text);
  };

  return { outgoing, retry };
}
