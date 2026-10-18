import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner-native";
import { friendActivityQueryOptions } from "@/hooks/useFriendActivity";
import { friendsQueryOptions } from "@/hooks/useFriends";
import { friendSuggestionsQueryOptions } from "@/hooks/useFriendSuggestions";
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
    onSuccess: (result) => {
      if (result.outcome === "BECAME_FRIENDS") {
        toast.success("You're now friends");
      }
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Couldn't send the request"));
    },
    onSettled: (result) => {
      const invalidations = [
        queryClient.invalidateQueries({ queryKey: ["friend-requests"] }),
        queryClient.invalidateQueries({ queryKey: ["users", "search"] }),
        queryClient.invalidateQueries({ queryKey: ["profiles"] }),
      ];
      if (result?.outcome !== "REQUEST_SENT") {
        invalidations.push(
          queryClient.invalidateQueries({
            queryKey: friendSuggestionsQueryOptions.queryKey,
          }),
          queryClient.invalidateQueries({
            queryKey: friendsQueryOptions.queryKey,
          }),
          queryClient.invalidateQueries({
            queryKey: friendActivityQueryOptions.queryKey,
          }),
        );
      }
      return Promise.all(invalidations);
    },
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
        queryClient.invalidateQueries({ queryKey: ["users", "search"] }),
        queryClient.invalidateQueries({ queryKey: ["profiles"] }),
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
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["friend-requests"] }),
        queryClient.invalidateQueries({ queryKey: ["profiles"] }),
      ]),
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
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["friend-requests"] }),
        queryClient.invalidateQueries({ queryKey: ["users", "search"] }),
        queryClient.invalidateQueries({ queryKey: ["profiles"] }),
      ]),
  });
}
