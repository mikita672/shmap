import { queryOptions, useQuery } from "@tanstack/react-query";
import { getPublicProfile } from "@/lib/api/profiles";

export const publicProfileQueryOptions = (username: string) =>
  queryOptions({
    queryKey: ["profiles", username],
    queryFn: async () => {
      const { data } = await getPublicProfile(username);
      return data;
    },
  });

export function usePublicProfile(username: string) {
  return useQuery(publicProfileQueryOptions(username));
}
