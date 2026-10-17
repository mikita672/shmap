import { queryOptions, useQuery } from "@tanstack/react-query";
import { getFriendSuggestions } from "@/lib/api/friend-suggestions";

export const friendSuggestionsQueryOptions = queryOptions({
  queryKey: ["friend-suggestions"],
  queryFn: async () => {
    const { data } = await getFriendSuggestions();
    return data;
  },
});

export function useFriendSuggestions() {
  return useQuery(friendSuggestionsQueryOptions);
}
