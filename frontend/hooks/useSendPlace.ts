import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chatQueryOptions } from "@/hooks/useChat";
import { friendsQueryOptions } from "@/hooks/useFriends";
import { openDirectChat, sendChatMessage } from "@/lib/api/chats";
import {
  addMessageToCache,
  addMessageToChatList,
  moveReadPosition,
} from "@/lib/chat-cache";
import type { SendTarget } from "@/lib/send-target";
import { AuthErrorCode, type ChatPlace } from "@/lib/types/api";
import { isErrorCode } from "@/lib/utils/error";

export interface SendPlaceTarget {
  target: SendTarget;
  clientId: string;
}

export interface SendPlaceVariables {
  place: ChatPlace;
  targets: SendPlaceTarget[];
}

export type SendPlaceResult =
  | { target: SendTarget; ok: true }
  | { target: SendTarget; ok: false; error: unknown };

export function useSendPlace() {
  const queryClient = useQueryClient();

  const sendToTarget = async (
    place: ChatPlace,
    { target, clientId }: SendPlaceTarget,
  ) => {
    let chatId: number;
    if (target.kind === "group") {
      chatId = target.chatId;
    } else {
      const { data: chat } = await openDirectChat(target.userId);
      queryClient.setQueryData(chatQueryOptions(chat.id).queryKey, chat);
      chatId = chat.id;
    }

    const { data: message } = await sendChatMessage(chatId, {
      place,
      clientId,
    });
    addMessageToCache(queryClient, chatId, message);
    addMessageToChatList(queryClient, chatId, message);
    moveReadPosition(queryClient, chatId, message.id);
  };

  return useMutation({
    mutationFn: async ({
      place,
      targets,
    }: SendPlaceVariables): Promise<SendPlaceResult[]> => {
      const settled = await Promise.allSettled(
        targets.map((target) => sendToTarget(place, target)),
      );
      return settled.map((outcome, index) =>
        outcome.status === "fulfilled"
          ? { target: targets[index].target, ok: true }
          : {
              target: targets[index].target,
              ok: false,
              error: outcome.reason,
            },
      );
    },
    onSuccess: (results) => {
      const lostFriend = results.some(
        (result) =>
          !result.ok &&
          (isErrorCode(result.error, AuthErrorCode.NOT_FRIENDS) ||
            isErrorCode(result.error, AuthErrorCode.USER_NOT_FOUND)),
      );
      if (lostFriend) {
        void queryClient.invalidateQueries({
          queryKey: friendsQueryOptions.queryKey,
        });
      }
    },
  });
}
