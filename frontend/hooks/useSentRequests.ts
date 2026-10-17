import { queryOptions, useQuery } from "@tanstack/react-query";
import { getSentRequests } from "@/lib/api/friend-requests";

export const sentRequestsQueryOptions = queryOptions({
  queryKey: ["friend-requests", "sent"],
  queryFn: async () => {
    const { data } = await getSentRequests();
    return data;
  },
});

export function useSentRequests() {
  return useQuery(sentRequestsQueryOptions);
}
