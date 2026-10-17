import { queryOptions, useQuery } from "@tanstack/react-query";
import { getFriends } from "@/lib/api/friends";

export const friendsQueryOptions = queryOptions({
  queryKey: ["friends"],
  queryFn: async () => {
    const { data } = await getFriends();
    return data;
  },
});

export function useFriends() {
  return useQuery(friendsQueryOptions);
}
