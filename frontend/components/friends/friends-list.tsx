import { ActivityIndicator, SectionList, View } from "react-native";
import { FriendRow } from "@/components/friends/friend-row";
import { Button } from "@/components/ui/button";
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

  return (
    <SectionList
      sections={[{ data: friends }]}
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
      ItemSeparatorComponent={RowGap}
      contentContainerClassName="px-6 pt-4 pb-6"
    />
  );
}

function RowGap() {
  return <View className="h-2" />;
}
