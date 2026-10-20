import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner-native";
import { friendActivityQueryOptions } from "@/hooks/useFriendActivity";
import { friendsQueryOptions } from "@/hooks/useFriends";
import { friendSuggestionsQueryOptions } from "@/hooks/useFriendSuggestions";
import { blockUser } from "@/lib/api/blocks";
import type { UserSummaryResponse } from "@/lib/types/api";
import { getErrorMessage } from "@/lib/utils/error";

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
      ]),
  });
}
