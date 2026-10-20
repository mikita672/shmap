import { ActivityIndicator, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { UserList } from "@/components/friends/user-list";
import { Button } from "@/components/ui/button";
import { NoteCard } from "@/components/ui/note-card";
import { ScreenHeader } from "@/components/ui/screen-header";
import { Text } from "@/components/ui/text";
import { useProfileFriends } from "@/hooks/useProfileFriends";
import { usePublicProfile } from "@/hooks/usePublicProfile";
import { AuthErrorCode } from "@/lib/types/api";
import { getErrorMessage, isErrorCode } from "@/lib/utils/error";

export default function ProfileFriendsScreen() {
  const { username } = useLocalSearchParams<{ username: string }>();
  const { data: profile } = usePublicProfile(username);
  const {
    data: users,
    isPending,
    error,
    refetch,
  } = useProfileFriends(username);
  const firstName = profile?.user.firstName;

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title={firstName ? `${firstName}'s friends` : "Friends"} />

      {isPending ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      ) : !users ? (
        <View className="flex-1 items-center justify-center gap-4 px-6">
          {isErrorCode(error, AuthErrorCode.PRIVATE_ACCOUNT) ? (
            <NoteCard
              className="self-stretch"
              title="This account is private"
              description="Become friends to see their friends"
            />
          ) : isErrorCode(error, AuthErrorCode.FRIENDS_LIST_HIDDEN) ? (
            <NoteCard
              className="self-stretch"
              title="This friends list is hidden"
              description="Only they can see who their friends are"
            />
          ) : (
            <>
              <Text className="text-center">
                {getErrorMessage(error, "Couldn't load friends")}
              </Text>
              <Button onPress={() => refetch()}>
                <Text>Retry</Text>
              </Button>
            </>
          )}
        </View>
      ) : (
        <UserList
          users={users}
          emptyTitle="No friends yet"
          emptyDescription="Their friends will show up here"
        />
      )}
    </View>
  );
}
