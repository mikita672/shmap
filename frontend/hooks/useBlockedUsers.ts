import { queryOptions, useQuery } from "@tanstack/react-query";
import { getBlockedUsers } from "@/lib/api/blocks";

export const blockedUsersQueryOptions = queryOptions({
  queryKey: ["blocks"],
  queryFn: async () => {
    const { data } = await getBlockedUsers();
    return data;
  },
});

export function useBlockedUsers() {
  return useQuery(blockedUsersQueryOptions);
}
