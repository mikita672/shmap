import { queryOptions, useQuery } from "@tanstack/react-query";
import { getIncomingRequestCount } from "@/lib/api/friend-requests";

export const incomingRequestCountQueryOptions = queryOptions({
  queryKey: ["friend-requests", "incoming", "count"],
  queryFn: async () => {
    const { data } = await getIncomingRequestCount();
    return data.count;
  },
});

export function useIncomingRequestCount() {
  return useQuery(incomingRequestCountQueryOptions);
}
