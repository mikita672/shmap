import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner-native";
import { friendsQueryOptions } from "@/hooks/useFriends";
import {
  acceptFriendRequest,
  cancelFriendRequest,
  declineFriendRequest,
} from "@/lib/api/friend-requests";
import { getErrorMessage } from "@/lib/utils/error";

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
