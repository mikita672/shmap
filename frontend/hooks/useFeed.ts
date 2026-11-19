import {
  infiniteQueryOptions,
  useInfiniteQuery,
  type QueryClient,
} from "@tanstack/react-query";
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

export function removeRouteFromFeed(queryClient: QueryClient, routeId: number) {
  queryClient.setQueryData(feedQueryOptions.queryKey, (old) =>
    old
      ? {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            routes: page.routes.filter((route) => route.id !== routeId),
          })),
        }
      : old,
  );
}

export function markFeedStale(queryClient: QueryClient) {
  return queryClient.invalidateQueries({
    queryKey: feedQueryOptions.queryKey,
    refetchType: "none",
  });
}
