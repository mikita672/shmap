import { ActivityIndicator, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { UserList } from "@/components/friends/user-list";
import { Button } from "@/components/ui/button";
import { ScreenHeader } from "@/components/ui/screen-header";
import { Text } from "@/components/ui/text";
import { useMutualFriends } from "@/hooks/useMutualFriends";
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
        <UserList
          users={users}
          emptyTitle="No mutual friends"
          emptyDescription="You don't share any friends yet"
        />
      )}
    </View>
  );
}
