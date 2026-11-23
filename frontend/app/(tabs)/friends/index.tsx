import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQueryClient } from "@tanstack/react-query";
import { router, useScrollToTop } from "expo-router";
import { FeedRouteCard } from "@/components/feed/feed-route-card";
import { Button } from "@/components/ui/button";
import { NoteCard } from "@/components/ui/note-card";
import { PillButton } from "@/components/ui/pill-button";
import { RefreshControl } from "@/components/ui/refresh-control";
import { RoundButton } from "@/components/ui/round-button";
import { Text } from "@/components/ui/text";
import { feedQueryOptions, useFeed } from "@/hooks/useFeed";
import { useFriends } from "@/hooks/useFriends";
import { useIncomingRequestCount } from "@/hooks/useIncomingRequestCount";
import { useOpenProfile } from "@/hooks/useOpenProfile";
import { useProfile } from "@/hooks/useProfile";
import { useRefreshByUser } from "@/hooks/useRefreshByUser";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
import { AuthErrorCode, type FeedRouteResponse } from "@/lib/types/api";
import { getErrorMessage, isErrorCode } from "@/lib/utils/error";

export default function FriendsFeedScreen() {
  const insets = useSafeAreaInsets();
  const { data: requestCount = 0, refetch: refetchRequestCount } =
    useIncomingRequestCount();
  useRefreshOnFocus(refetchRequestCount);
  const headerTop = Math.max(insets.top + 8, 48);

  return (
    <View className="flex-1 bg-background">
      <View
        className="flex-row items-center justify-between px-6"
        style={{ marginTop: headerTop }}
      >
        <Text
          role="heading"
          className="text-heading text-[32px] leading-10 tracking-[0.5px]"
        >
          Friends
        </Text>
        <RoundButton
          icon="groups"
          size="lg"
          badge={requestCount}
          accessibilityLabel={friendsButtonLabel(requestCount)}
          onPress={() => router.push("/friends/hub")}
        />
      </View>

      <FeedBody />
    </View>
  );
}

const FEED_SIDE_PADDING = 8;
const NOW_REFRESH_MS = 30_000;

function FeedBody() {
  const { width } = useWindowDimensions();
  const listRef = useRef<FlatList<FeedRouteResponse>>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), NOW_REFRESH_MS);
    return () => clearInterval(timer);
  }, []);

  useScrollToTop(listRef);
  const { data: profile } = useProfile();
  const openProfile = useOpenProfile();
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
  } = useFeed();
  const queryClient = useQueryClient();
  useRefreshOnFocus(
    useCallback(
      () =>
        queryClient.refetchQueries({
          queryKey: feedQueryOptions.queryKey,
          stale: true,
        }),
      [queryClient],
    ),
  );
  const { isRefetchingByUser, refetchByUser } = useRefreshByUser(async () => {
    queryClient.setQueryData(
      feedQueryOptions.queryKey,
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
          message={getErrorMessage(error, "Couldn't load routes")}
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
          mapWidth={width - FEED_SIDE_PADDING * 2}
          onPress={() =>
            router.push({
              pathname: "/route/[routeId]",
              params: { routeId: String(item.id) },
            })
          }
          onAuthorPress={() => openProfile(item.participants[0])}
        />
      )}
      ItemSeparatorComponent={FeedGap}
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
          <FeedLoadingMore />
        ) : isFetchNextPageError ? (
          <FeedLoadMoreError
            onRetry={() => {
              if (isErrorCode(error, AuthErrorCode.VALIDATION_FAILED)) {
                queryClient.resetQueries({
                  queryKey: feedQueryOptions.queryKey,
                });
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
          <View className="flex-1 justify-center px-4">
            <FeedEmpty />
          </View>
        )
      }
      contentContainerClassName="flex-grow px-2 pb-4 pt-4"
    />
  );
}

function FeedGap() {
  return <View className="h-4" />;
}

function FeedLoadingMore() {
  return (
    <View className="items-center pt-4">
      <ActivityIndicator size="small" className="text-heading" />
    </View>
  );
}

function FeedLoadMoreError({ onRetry }: { onRetry: () => void }) {
  return (
    <View className="items-center gap-2 pt-4">
      <Text className="text-sm leading-5 tracking-[0.25px]">
        {"Couldn't load more routes"}
      </Text>
      <PillButton label="Retry" onPress={onRetry} />
    </View>
  );
}

function FeedEmpty() {
  const { data: friends, isPending, error, refetch } = useFriends();

  if (isPending) {
    return <ActivityIndicator size="large" />;
  }

  if (!friends) {
    return (
      <LoadError
        message={getErrorMessage(error, "Couldn't load your friends")}
        onRetry={() => refetch()}
      />
    );
  }

  if (friends.length === 0) {
    return (
      <NoteCard
        title="Add friends to see their routes"
        description="Tap the friends button above to find people you know."
      />
    );
  }

  return (
    <NoteCard
      title="No routes yet"
      description="Routes your friends take will show up here."
    />
  );
}

function LoadError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <View className="items-center gap-4">
      <Text className="text-center">{message}</Text>
      <Button onPress={onRetry}>
        <Text>Retry</Text>
      </Button>
    </View>
  );
}

function friendsButtonLabel(requestCount: number) {
  if (requestCount <= 0) return "Friends";
  const requests = requestCount === 1 ? "request" : "requests";
  return `Friends, ${requestCount} pending ${requests}`;
}
