import { ActivityIndicator, SectionList, View } from "react-native";
import { FriendRow } from "@/components/friends/friend-row";
import { Button } from "@/components/ui/button";
import { SectionLabel } from "@/components/ui/section-label";
import { Text } from "@/components/ui/text";
import { useFriends } from "@/hooks/useFriends";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
import { getErrorMessage } from "@/lib/utils/error";

export function FriendsList() {
  const { data: friends, isPending, error, refetch } = useFriends();
  useRefreshOnFocus(refetch);

  if (isPending) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!friends) {
    return (
      <View className="flex-1 items-center justify-center gap-4 px-6">
        <Text className="text-center">
          {getErrorMessage(error, "Couldn't load your friends")}
        </Text>
        <Button onPress={() => refetch()}>
          <Text>Retry</Text>
        </Button>
      </View>
    );
  }

  const sections = [
    {
      key: "favorites",
      title: "Favorites",
      data: friends.filter((friend) => friend.favorite),
    },
    {
      key: "all",
      title: `All friends · ${friends.length}`,
      data: friends.filter((friend) => !friend.favorite),
    },
  ].filter((section) => section.data.length > 0);

  return (
    <SectionList
      sections={sections}
      keyExtractor={(friend) => String(friend.user.id)}
      renderItem={({ item: { user } }) => (
        <FriendRow
          variant="actions"
          name={`${user.firstName} ${user.lastName}`}
          subtitle={`@${user.username}`}
          avatarUrl={user.avatarUrl}
          onMore={() => {}}
        />
      )}
      renderSectionHeader={({ section }) => (
        <SectionLabel title={section.title} className="pb-2 pt-4" />
      )}
      stickySectionHeadersEnabled={false}
      ItemSeparatorComponent={RowGap}
      contentContainerClassName="px-6 pb-6"
    />
  );
}

function RowGap() {
  return <View className="h-2" />;
}
