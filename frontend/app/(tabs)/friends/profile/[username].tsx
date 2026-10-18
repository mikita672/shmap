import { ActivityIndicator, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Redirect, useLocalSearchParams } from "expo-router";
import { Avatar } from "@/components/ui/avatar";
import { BackButton } from "@/components/ui/back-button";
import { Button } from "@/components/ui/button";
import { NoteCard } from "@/components/ui/note-card";
import { Text } from "@/components/ui/text";
import { usePublicProfile } from "@/hooks/usePublicProfile";
import { AuthErrorCode } from "@/lib/types/api";
import { getErrorMessage, isErrorCode } from "@/lib/utils/error";

export default function UserProfileScreen() {
  const insets = useSafeAreaInsets();
  const { username } = useLocalSearchParams<{ username: string }>();
  const {
    data: profile,
    isPending,
    error,
    refetch,
  } = usePublicProfile(username);
  const top = Math.max(insets.top + 8, 48);

  if (profile?.relationship === "SELF") {
    return <Redirect href="/profile" />;
  }

  return (
    <View className="flex-1 bg-background">
      <BackButton className="absolute left-6 z-10" style={{ top }} />

      {isPending ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      ) : !profile ? (
        <View className="flex-1 items-center justify-center gap-4 px-6">
          {isErrorCode(error, AuthErrorCode.USER_NOT_FOUND) ? (
            <NoteCard
              className="self-stretch"
              title="This profile doesn't exist"
              description="The link may be broken, or the username has changed."
            />
          ) : (
            <>
              <Text className="text-center">
                {getErrorMessage(error, "Couldn't load this profile")}
              </Text>
              <Button onPress={() => refetch()}>
                <Text>Retry</Text>
              </Button>
            </>
          )}
        </View>
      ) : (
        <View className="items-center gap-4 px-6" style={{ paddingTop: top }}>
          <Avatar uri={profile.user.avatarUrl} size={150} />

          <View className="items-center gap-1 self-stretch">
            <Text className="text-center text-[28px] leading-9 tracking-[0.5px] text-action-foreground">
              {profile.user.firstName} {profile.user.lastName}
            </Text>
            <Text className="text-center leading-6 tracking-[0.5px] text-secondary">
              @{profile.user.username}
            </Text>
          </View>

          {profile.bio ? (
            <Text className="text-center leading-6 tracking-[0.5px] text-action-foreground">
              {profile.bio}
            </Text>
          ) : null}
        </View>
      )}
    </View>
  );
}
