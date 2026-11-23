import { useRef } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useScrollToTop } from "expo-router";
import { RouteCardList } from "@/components/routes/route-card-list";
import { LoadError } from "@/components/ui/load-error";
import { NoteCard } from "@/components/ui/note-card";
import { RoundButton } from "@/components/ui/round-button";
import { Text } from "@/components/ui/text";
import { feedQueryOptions, useFeed } from "@/hooks/useFeed";
import { useFriends } from "@/hooks/useFriends";
import { useIncomingRequestCount } from "@/hooks/useIncomingRequestCount";
import { useOpenProfile } from "@/hooks/useOpenProfile";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
import type { FeedRouteResponse } from "@/lib/types/api";
import { getErrorMessage } from "@/lib/utils/error";

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

function FeedBody() {
  const listRef = useRef<FlatList<FeedRouteResponse>>(null);
  useScrollToTop(listRef);
  const openProfile = useOpenProfile();
  const query = useFeed();

  return (
    <RouteCardList
      query={query}
      queryKey={feedQueryOptions.queryKey}
      errorMessage="Couldn't load routes"
      empty={<FeedEmpty />}
      onAuthorPress={openProfile}
      listRef={listRef}
    />
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

function friendsButtonLabel(requestCount: number) {
  if (requestCount <= 0) return "Friends";
  const requests = requestCount === 1 ? "request" : "requests";
  return `Friends, ${requestCount} pending ${requests}`;
}
