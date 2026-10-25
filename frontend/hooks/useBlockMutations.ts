import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner-native";
import { blockedUsersQueryOptions } from "@/hooks/useBlockedUsers";
import { friendActivityQueryOptions } from "@/hooks/useFriendActivity";
import { friendsQueryOptions } from "@/hooks/useFriends";
import { friendSuggestionsQueryOptions } from "@/hooks/useFriendSuggestions";
import { blockUser, unblockUser } from "@/lib/api/blocks";
import { AuthErrorCode, type UserSummaryResponse } from "@/lib/types/api";
import { getErrorMessage, isErrorCode } from "@/lib/utils/error";

export function useBlockUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (user: UserSummaryResponse) => blockUser(user.id),
    onSuccess: (_, user) => {
      toast.success(`${user.firstName} blocked`);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Couldn't block this user"));
    },
    onSettled: () =>
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: friendsQueryOptions.queryKey,
        }),
        queryClient.invalidateQueries({ queryKey: ["profiles"] }),
        queryClient.invalidateQueries({
          queryKey: friendActivityQueryOptions.queryKey,
        }),
        queryClient.invalidateQueries({
          queryKey: friendSuggestionsQueryOptions.queryKey,
        }),
        queryClient.invalidateQueries({ queryKey: ["users", "search"] }),
        queryClient.invalidateQueries({ queryKey: ["friend-requests"] }),
        queryClient.invalidateQueries({
          queryKey: blockedUsersQueryOptions.queryKey,
        }),
      ]),
  });
}

export function useUnblockUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (user: UserSummaryResponse) => {
      try {
        await unblockUser(user.id);
      } catch (error) {
        if (!isErrorCode(error, AuthErrorCode.BLOCK_NOT_FOUND)) throw error;
      }
    },
    onSuccess: (_, user) => {
      toast.success(`${user.firstName} unblocked`);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Couldn't unblock this user"));
    },
    onSettled: () =>
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: blockedUsersQueryOptions.queryKey,
        }),
        queryClient.invalidateQueries({ queryKey: ["profiles"] }),
        queryClient.invalidateQueries({
          queryKey: friendSuggestionsQueryOptions.queryKey,
        }),
        queryClient.invalidateQueries({ queryKey: ["users", "search"] }),
      ]),
  });
}
