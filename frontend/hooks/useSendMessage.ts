import {
  useMutation,
  useMutationState,
  useQueryClient,
} from "@tanstack/react-query";
import * as Crypto from "expo-crypto";
import { toast } from "sonner-native";
import { chatQueryOptions } from "@/hooks/useChat";
import { sendChatMessage } from "@/lib/api/chats";
import {
  addMessageToCache,
  addMessageToChatList,
  moveReadPosition,
} from "@/lib/chat-cache";
import type { OutgoingMessage } from "@/lib/chat-items";
import {
  AuthErrorCode,
  type ChatPlace,
  type SendChatMessageRequest,
} from "@/lib/types/api";
import { getErrorMessage, isErrorCode } from "@/lib/utils/error";

export type MessageContent = { text: string } | { place: ChatPlace };

const sendMutationKey = (chatId: number) => ["chats", chatId, "send"];

function useSendMutation(chatId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: sendMutationKey(chatId),
    scope: { id: `chat-${chatId}` },
    gcTime: 24 * 60 * 60 * 1000,
    mutationFn: async (content: SendChatMessageRequest) => {
      const { data } = await sendChatMessage(chatId, content);
      return data;
    },
    onSuccess: (message) => {
      addMessageToCache(queryClient, chatId, message);
      addMessageToChatList(queryClient, chatId, message);
      moveReadPosition(queryClient, chatId, message.id);
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

export function useSendMessage(chatId: number) {
  const { mutate } = useSendMutation(chatId);

  const send = (content: MessageContent) =>
    mutate({ ...content, clientId: Crypto.randomUUID() });

  return { send };
}

export function useOutgoingMessages(chatId: number) {
  const queryClient = useQueryClient();
  const { mutate } = useSendMutation(chatId);

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
      content: state.variables as SendChatMessageRequest,
      failed: state.status === "error",
    }),
  });

  const retry = (message: OutgoingMessage) => {
    const mutationCache = queryClient.getMutationCache();
    const failed = mutationCache
      .findAll({ mutationKey: sendMutationKey(chatId), status: "error" })
      .find((mutation) => mutation.state.submittedAt === message.submittedAt);
    if (failed) mutationCache.remove(failed);
    mutate(message.content);
  };

  return { outgoing, retry };
}
