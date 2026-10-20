import { queryOptions, useQuery } from "@tanstack/react-query";
import { getMutualFriends } from "@/lib/api/profiles";

export const mutualFriendsQueryOptions = (username: string) =>
  queryOptions({
    queryKey: ["profiles", username, "mutual-friends"],
    queryFn: async () => {
      const { data } = await getMutualFriends(username);
      return data;
    },
  });

export function useMutualFriends(username: string, enabled = true) {
  return useQuery({ ...mutualFriendsQueryOptions(username), enabled });
}
