import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { toast } from "sonner-native";
import {
  addChatMembers,
  createGroupChat,
  leaveChat,
  openDirectChat,
} from "@/lib/api/chats";
import { refetchUnreadTotal } from "@/lib/chat-cache";
import { AuthErrorCode, type CreateGroupChatRequest } from "@/lib/types/api";
import { getErrorMessage, isErrorCode } from "@/lib/utils/error";
import { chatQueryOptions } from "@/hooks/useChat";
import { friendsQueryOptions } from "@/hooks/useFriends";

export function useOpenDirectChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: number) => {
      const response = await openDirectChat(userId);
      return response.data;
    },
    onSuccess: (chat) => {
      queryClient.setQueryData(chatQueryOptions(chat.id).queryKey, chat);
      router.push({
        pathname: "/chat/[chatId]",
        params: { chatId: String(chat.id) },
      });
    },
    onError: (error) => {
      const isGone =
        isErrorCode(error, AuthErrorCode.NOT_FRIENDS) ||
        isErrorCode(error, AuthErrorCode.USER_NOT_FOUND);
      if (isGone) {
        void queryClient.invalidateQueries({
          queryKey: friendsQueryOptions.queryKey,
        });
        void queryClient.invalidateQueries({ queryKey: ["profiles"] });
      }
      toast.error(getErrorMessage(error, "Couldn't open chat"));
    },
  });
}

export function useCreateGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateGroupChatRequest) => {
      const response = await createGroupChat(data);
      return response.data;
    },
    onSuccess: async (chat) => {
      queryClient.setQueryData(["chats", chat.id], chat);
      await queryClient.refetchQueries({ queryKey: ["chats"], exact: true });
      router.dismissAll();
      router.push({
        pathname: "/chat/[chatId]",
        params: { chatId: String(chat.id) },
      });
    },
    onError: (error) => {
      const isNotFriends = isErrorCode(error, AuthErrorCode.NOT_FRIENDS);
      if (isNotFriends) {
        void queryClient.invalidateQueries({
          queryKey: friendsQueryOptions.queryKey,
        });
      }
      toast.error(
        isNotFriends
          ? getErrorMessage(error, "You can only add friends to a group")
          : getErrorMessage(error, "Couldn't create group"),
      );
    },
  });
}

export function useLeaveChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (chatId: number) => {
      await leaveChat(chatId);
      return chatId;
    },
    onSuccess: async (chatId) => {
      queryClient.removeQueries({ queryKey: ["chats", chatId] });
      void refetchUnreadTotal(queryClient);
      await queryClient.refetchQueries({ queryKey: ["chats"], exact: true });
      router.dismissAll();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Couldn't leave group"));
    },
  });
}

interface AddChatMembersVariables {
  chatId: number;
  userIds: number[];
}

export function useAddChatMembers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ chatId, userIds }: AddChatMembersVariables) => {
      const response = await addChatMembers(chatId, userIds);
      return response.data;
    },
    onSuccess: async (chat) => {
      queryClient.setQueryData(["chats", chat.id], chat);
      await queryClient.refetchQueries({ queryKey: ["chats"], exact: true });
      router.back();
    },
    onError: (error, { chatId }) => {
      const isNotFriends = isErrorCode(error, AuthErrorCode.NOT_FRIENDS);
      if (isNotFriends) {
        void queryClient.invalidateQueries({
          queryKey: friendsQueryOptions.queryKey,
        });
        void queryClient.invalidateQueries({
          queryKey: chatQueryOptions(chatId).queryKey,
          exact: true,
        });
      }
      toast.error(
        isNotFriends
          ? getErrorMessage(error, "You can only add friends to a group")
          : getErrorMessage(error, "Couldn't add members"),
      );
    },
  });
}
