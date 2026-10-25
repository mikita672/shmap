import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { toast } from "sonner-native";
import { createGroupChat, leaveChat } from "@/lib/api/chats";
import type { CreateGroupChatRequest } from "@/lib/types/api";
import { getErrorMessage } from "@/lib/utils/error";

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
      toast.error(getErrorMessage(error, "Couldn't create group"));
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
      await queryClient.refetchQueries({ queryKey: ["chats"], exact: true });
      router.dismissAll();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Couldn't leave group"));
    },
  });
}
