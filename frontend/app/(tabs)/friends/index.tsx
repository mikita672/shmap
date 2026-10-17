import { ActivityIndicator, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Button } from "@/components/ui/button";
import { NoteCard } from "@/components/ui/note-card";
import { RoundButton } from "@/components/ui/round-button";
import { Text } from "@/components/ui/text";
import { useFriends } from "@/hooks/useFriends";
import { useIncomingRequestCount } from "@/hooks/useIncomingRequestCount";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
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

      <View className="flex-1 justify-center px-6">
        <FeedBody />
      </View>
    </View>
  );
}

function FeedBody() {
  const { data: friends, isPending, error, refetch } = useFriends();
  useRefreshOnFocus(refetch);

  if (isPending) {
    return <ActivityIndicator size="large" />;
  }

  if (!friends) {
    return (
      <View className="items-center gap-4">
        <Text className="text-center">
          {getErrorMessage(error, "Couldn't load your friends")}
        </Text>
        <Button onPress={() => refetch()}>
          <Text>Retry</Text>
        </Button>
      </View>
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
