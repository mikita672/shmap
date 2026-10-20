import { ActivityIndicator, FlatList, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { FriendRow } from "@/components/friends/friend-row";
import { Button } from "@/components/ui/button";
import { NoteCard } from "@/components/ui/note-card";
import { ScreenHeader } from "@/components/ui/screen-header";
import { Text } from "@/components/ui/text";
import { useMutualFriends } from "@/hooks/useMutualFriends";
import { getProfileHref } from "@/lib/profile-link";
import { getErrorMessage } from "@/lib/utils/error";

export default function MutualFriendsScreen() {
  const { username } = useLocalSearchParams<{ username: string }>();
  const { data: users, isPending, error, refetch } = useMutualFriends(username);

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Mutual friends" />

      {isPending ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      ) : !users ? (
        <View className="flex-1 items-center justify-center gap-4 px-6">
          <Text className="text-center">
            {getErrorMessage(error, "Couldn't load mutual friends")}
          </Text>
          <Button onPress={() => refetch()}>
            <Text>Retry</Text>
          </Button>
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(user) => String(user.id)}
          renderItem={({ item: user }) => (
            <FriendRow
              variant="plain"
              name={`${user.firstName} ${user.lastName}`}
              subtitle={`@${user.username}`}
              avatarUrl={user.avatarUrl}
              onPress={() => router.push(getProfileHref(user.username))}
            />
          )}
          ListEmptyComponent={
            <NoteCard
              title="No mutual friends"
              description="You don't share any friends yet"
            />
          }
          ItemSeparatorComponent={RowGap}
          contentContainerClassName="px-6 pb-6 pt-4"
        />
      )}
    </View>
  );
}

function RowGap() {
  return <View className="h-2" />;
}
