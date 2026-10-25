import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner-native";
import { friendActivityQueryOptions } from "@/hooks/useFriendActivity";
import { friendsQueryOptions } from "@/hooks/useFriends";
import { friendSuggestionsQueryOptions } from "@/hooks/useFriendSuggestions";
import {
  addFavorite,
  muteFriend,
  removeFavorite,
  removeFriend,
  unmuteFriend,
} from "@/lib/api/friends";
import type { UserSummaryResponse } from "@/lib/types/api";
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

interface SetMutedVariables {
  friend: UserSummaryResponse;
  muted: boolean;
}

export function useSetMuted() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ friend, muted }: SetMutedVariables) =>
      muted ? muteFriend(friend.id) : unmuteFriend(friend.id),
    onSuccess: (_, { friend, muted }) => {
      toast.success(
        `${friend.firstName}'s routes ${muted ? "muted" : "unmuted"}`,
      );
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Couldn't update muted routes"));
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

export function useRemoveFriend() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeFriend,
    onError: (error) => {
      toast.error(getErrorMessage(error, "Couldn't remove the friend"));
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
      ]),
  });
}
