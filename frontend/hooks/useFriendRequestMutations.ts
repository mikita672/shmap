import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner-native";
import { friendActivityQueryOptions } from "@/hooks/useFriendActivity";
import { friendsQueryOptions } from "@/hooks/useFriends";
import {
  acceptFriendRequest,
  cancelFriendRequest,
  declineFriendRequest,
  sendFriendRequest,
} from "@/lib/api/friend-requests";
import { getErrorMessage } from "@/lib/utils/error";

export function useSendFriendRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (receiverId: number) => {
      const { data } = await sendFriendRequest(receiverId);
      return data;
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Couldn't send the request"));
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["friend-requests"] }),
  });
}

export function useAcceptFriendRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: acceptFriendRequest,
    onError: (error) => {
      toast.error(getErrorMessage(error, "Couldn't accept the request"));
    },
    onSettled: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["friend-requests"] }),
        queryClient.invalidateQueries({
          queryKey: friendsQueryOptions.queryKey,
        }),
        queryClient.invalidateQueries({
          queryKey: friendActivityQueryOptions.queryKey,
        }),
      ]),
  });
}

export function useDeclineFriendRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: declineFriendRequest,
    onError: (error) => {
      toast.error(getErrorMessage(error, "Couldn't decline the request"));
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["friend-requests"] }),
  });
}

export function useCancelFriendRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelFriendRequest,
    onError: (error) => {
      toast.error(getErrorMessage(error, "Couldn't cancel the request"));
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["friend-requests"] }),
  });
}
