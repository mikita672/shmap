import { queryOptions, useQuery } from "@tanstack/react-query";
import { getMe } from "@/lib/api/users";

export const profileQueryOptions = queryOptions({
  queryKey: ["users", "me"],
  queryFn: async () => {
    const { data } = await getMe();
    return data;
  },
});

export function useProfile() {
  return useQuery(profileQueryOptions);
}
