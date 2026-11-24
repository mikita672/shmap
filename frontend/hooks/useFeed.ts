import {
  infiniteQueryOptions,
  useInfiniteQuery,
  type QueryClient,
} from "@tanstack/react-query";
import { feedMapQueryOptions } from "@/hooks/useFeedMap";
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
  const keys = [feedQueryOptions.queryKey, feedMapQueryOptions.queryKey];
  const invalidated = keys.filter(
    (queryKey) => queryClient.getQueryState(queryKey)?.isInvalidated ?? false,
  );
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
  queryClient.setQueryData(feedMapQueryOptions.queryKey, (old) =>
    old
      ? { ...old, routes: old.routes.filter((route) => route.id !== routeId) }
      : old,
  );
  for (const queryKey of invalidated) {
    void queryClient.invalidateQueries({
      queryKey,
      exact: true,
      refetchType: "none",
    });
  }
}

export function markFeedStale(queryClient: QueryClient) {
  return queryClient.invalidateQueries({
    queryKey: feedQueryOptions.queryKey,
    refetchType: "none",
  });
}
