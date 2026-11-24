import { queryOptions, useQuery } from "@tanstack/react-query";
import { getFeedMap } from "@/lib/api/feed";

const FEED_MAP_STALE_TIME_MS = 60_000;

export const feedMapQueryOptions = queryOptions({
  queryKey: ["feed", "map"],
  queryFn: async () => {
    const { data } = await getFeedMap();
    return data;
  },
  staleTime: FEED_MAP_STALE_TIME_MS,
});

export function useFeedMap(enabled: boolean) {
  return useQuery({ ...feedMapQueryOptions, enabled });
}
