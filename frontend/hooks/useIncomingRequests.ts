import { queryOptions, useQuery } from "@tanstack/react-query";
import { getIncomingRequests } from "@/lib/api/friend-requests";

export const incomingRequestsQueryOptions = queryOptions({
  queryKey: ["friend-requests", "incoming"],
  queryFn: async () => {
    const { data } = await getIncomingRequests();
    return data;
  },
});

export function useIncomingRequests() {
  return useQuery(incomingRequestsQueryOptions);
}
