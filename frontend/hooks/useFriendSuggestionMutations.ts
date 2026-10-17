import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner-native";
import { friendSuggestionsQueryOptions } from "@/hooks/useFriendSuggestions";
import { dismissFriendSuggestion } from "@/lib/api/friend-suggestions";
import { getErrorMessage } from "@/lib/utils/error";

export function useDismissFriendSuggestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: dismissFriendSuggestion,
    onSuccess: async (_, userId) => {
      await queryClient.cancelQueries({
        queryKey: friendSuggestionsQueryOptions.queryKey,
      });
      queryClient.setQueryData(friendSuggestionsQueryOptions.queryKey, (old) =>
        old?.filter((suggestion) => suggestion.user.id !== userId),
      );
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Couldn't dismiss the suggestion"));
    },
  });
}
