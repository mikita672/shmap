import { queryOptions, useQuery } from "@tanstack/react-query";
import { getFriendActivity } from "@/lib/api/friend-activity";

export const friendActivityQueryOptions = queryOptions({
  queryKey: ["friend-activity"],
  queryFn: async () => {
    const { data } = await getFriendActivity();
    return data;
  },
});

export function useFriendActivity() {
  return useQuery(friendActivityQueryOptions);
}
