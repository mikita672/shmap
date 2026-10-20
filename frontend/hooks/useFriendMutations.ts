import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner-native";
import { friendsQueryOptions } from "@/hooks/useFriends";
import { addFavorite, removeFavorite } from "@/lib/api/friends";
import { getErrorMessage } from "@/lib/utils/error";

interface SetFavoriteVariables {
  friendId: number;
  favorite: boolean;
}

export function useSetFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ friendId, favorite }: SetFavoriteVariables) =>
      favorite ? addFavorite(friendId) : removeFavorite(friendId),
    onError: (error) => {
      toast.error(getErrorMessage(error, "Couldn't update favorites"));
    },
    onSettled: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["profiles"] }),
        queryClient.invalidateQueries({
          queryKey: friendsQueryOptions.queryKey,
        }),
      ]),
  });
}
