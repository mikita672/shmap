import {
  useCallback,
  useEffect,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import {
  ActivityIndicator,
  FlatList,
  View,
  useWindowDimensions,
} from "react-native";
import {
  useQueryClient,
  type InfiniteData,
  type UseInfiniteQueryResult,
} from "@tanstack/react-query";
import { router } from "expo-router";
import { FeedRouteCard } from "@/components/feed/feed-route-card";
import { LoadError } from "@/components/ui/load-error";
import { PillButton } from "@/components/ui/pill-button";
import { RefreshControl } from "@/components/ui/refresh-control";
import { Text } from "@/components/ui/text";
import { useProfile } from "@/hooks/useProfile";
import { useRefreshByUser } from "@/hooks/useRefreshByUser";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
import {
  AuthErrorCode,
  type FeedPageResponse,
  type FeedRouteResponse,
  type UserSummaryResponse,
} from "@/lib/types/api";
import { getErrorMessage, isErrorCode } from "@/lib/utils/error";

const SIDE_PADDING = 8;
const NOW_REFRESH_MS = 30_000;

type Pages = InfiniteData<FeedPageResponse, unknown>;

export interface RouteCardListProps {
  query: UseInfiniteQueryResult<Pages>;
  queryKey: readonly unknown[];
  errorMessage: string;
  empty: ReactNode;
  onAuthorPress: (user: UserSummaryResponse) => void;
  listRef?: RefObject<FlatList<FeedRouteResponse> | null>;
}

export function RouteCardList({
  query,
  queryKey,
  errorMessage,
  empty,
  onAuthorPress,
  listRef,
}: RouteCardListProps) {
  const { width } = useWindowDimensions();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), NOW_REFRESH_MS);
    return () => clearInterval(timer);
  }, []);

  const { data: profile } = useProfile();
  const {
    data,
    isPending,
    error,
    refetch,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isFetchNextPageError,
    fetchNextPage,
  } = query;
  const queryClient = useQueryClient();
  useRefreshOnFocus(
    useCallback(
      () => queryClient.refetchQueries({ queryKey, stale: true }),
      [queryClient, queryKey],
    ),
  );
  const { isRefetchingByUser, refetchByUser } = useRefreshByUser(async () => {
    queryClient.setQueryData<Pages>(
      queryKey,
      (old) =>
        old && {
          pages: old.pages.slice(0, 1),
          pageParams: old.pageParams.slice(0, 1),
        },
    );
    await refetch();
  });

  if (isPending) {
    return (
      <View className="flex-1 justify-center px-6">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!data) {
    return (
      <View className="flex-1 justify-center px-6">
        <LoadError
          message={getErrorMessage(error, errorMessage)}
          onRetry={() => refetch()}
        />
      </View>
    );
  }

  const routes = data.pages.flatMap((page) => page.routes);

  return (
    <FlatList
      ref={listRef}
      data={routes}
      keyExtractor={(route) => String(route.id)}
      renderItem={({ item }) => (
        <FeedRouteCard
          route={item}
          myId={profile?.id}
          now={now}
          mapWidth={width - SIDE_PADDING * 2}
          onPress={() =>
            router.push({
              pathname: "/route/[routeId]",
              params: { routeId: String(item.id) },
            })
          }
          onAuthorPress={() => onAuthorPress(item.participants[0])}
        />
      )}
      ItemSeparatorComponent={CardGap}
      initialNumToRender={3}
      maxToRenderPerBatch={3}
      windowSize={5}
      onEndReached={() => {
        if (hasNextPage && !isFetching && !isFetchNextPageError) {
          fetchNextPage();
        }
      }}
      onEndReachedThreshold={1}
      ListFooterComponent={
        isFetchingNextPage ? (
          <LoadingMore />
        ) : isFetchNextPageError ? (
          <LoadMoreError
            onRetry={() => {
              if (isErrorCode(error, AuthErrorCode.VALIDATION_FAILED)) {
                queryClient.resetQueries({ queryKey });
              } else {
                fetchNextPage();
              }
            }}
          />
        ) : null
      }
      refreshControl={
        <RefreshControl
          refreshing={isRefetchingByUser}
          onRefresh={refetchByUser}
          className="bg-action text-secondary"
        />
      }
      ListEmptyComponent={
        hasNextPage ? null : (
          <View className="flex-1 justify-center px-4">{empty}</View>
        )
      }
      contentContainerClassName="flex-grow px-2 pb-4 pt-4"
    />
  );
}

function CardGap() {
  return <View className="h-4" />;
}

function LoadingMore() {
  return (
    <View className="items-center pt-4">
      <ActivityIndicator size="small" className="text-heading" />
    </View>
  );
}

function LoadMoreError({ onRetry }: { onRetry: () => void }) {
  return (
    <View className="items-center gap-2 pt-4">
      <Text className="text-sm leading-5 tracking-[0.25px]">
        {"Couldn't load more routes"}
      </Text>
      <PillButton label="Retry" onPress={onRetry} />
    </View>
  );
}
