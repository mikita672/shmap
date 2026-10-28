import { ActivityIndicator, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
import { NoteCard } from "@/components/ui/note-card";
import { Text } from "@/components/ui/text";
import { TitleHeader } from "@/components/ui/title-header";
import { useFriends } from "@/hooks/useFriends";
import { getErrorMessage } from "@/lib/utils/error";

export default function AddToGroupScreen() {
  const insets = useSafeAreaInsets();
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const { data: friends, isPending, error, refetch } = useFriends();
  const friend = friends?.find((f) => f.user.id === Number(userId));
  const title = friend
    ? `Add ${friend.user.firstName} to a group`
    : "Add to a group";

  return (
    <View className="flex-1 bg-background">
      <TitleHeader title={title} />

      {isPending ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      ) : !friends ? (
        <View className="flex-1 items-center justify-center gap-4 px-6">
          <Text className="text-center">
            {getErrorMessage(error, "Couldn't load your friends")}
          </Text>
          <Button onPress={() => refetch()}>
            <Text>Retry</Text>
          </Button>
        </View>
      ) : !friend ? (
        <View className="flex-1 justify-center px-6">
          <NoteCard
            title="You can only add friends to a group"
            description="This person isn't in your friends list anymore."
          />
        </View>
      ) : (
        <>
          <View className="flex-1" />
          <View
            className="px-6 pt-4"
            style={{ paddingBottom: insets.bottom + 24 }}
          >
            <Button size="xl" disabled>
              <Text className="text-2xl">Add</Text>
            </Button>
          </View>
        </>
      )}
    </View>
  );
}
