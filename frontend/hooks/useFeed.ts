import { infiniteQueryOptions, useInfiniteQuery } from "@tanstack/react-query";
import { getFeed } from "@/lib/api/feed";

const FEED_STALE_TIME_MS = 60_000;

export const feedQueryOptions = infiniteQueryOptions({
  queryKey: ["feed"],
  queryFn: async ({ pageParam }) => {
    const { data } = await getFeed(pageParam);
    return data;
  },
  initialPageParam: null as string | null,
  getNextPageParam: (lastPage) => lastPage.nextCursor,
  staleTime: FEED_STALE_TIME_MS,
});

export function useFeed() {
  return useInfiniteQuery(feedQueryOptions);
}
