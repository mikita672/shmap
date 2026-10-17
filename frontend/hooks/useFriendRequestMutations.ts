import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner-native";
import { friendsQueryOptions } from "@/hooks/useFriends";
import { acceptFriendRequest } from "@/lib/api/friend-requests";
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
