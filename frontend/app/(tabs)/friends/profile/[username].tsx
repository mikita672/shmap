import { ActivityIndicator, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Redirect, useLocalSearchParams } from "expo-router";
import { ProfileStats } from "@/components/friends/profile-stats";
import { RelationshipButton } from "@/components/friends/relationship-button";
import { Avatar } from "@/components/ui/avatar";
import { BackButton } from "@/components/ui/back-button";
import { Button } from "@/components/ui/button";
import { NoteCard } from "@/components/ui/note-card";
import { RoundButton } from "@/components/ui/round-button";
import { Text } from "@/components/ui/text";
import { usePublicProfile } from "@/hooks/usePublicProfile";
import { formatMonthYear } from "@/lib/format-date";
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
      <View
        className="pointer-events-box-none absolute left-6 right-6 z-10 flex-row items-center justify-between"
        style={{ top }}
      >
        <BackButton className="relative" />
        {profile && (
          <RoundButton
            icon="more-vert"
            accessibilityLabel={`More actions for ${profile.user.firstName} ${profile.user.lastName}`}
            disabled
          />
        )}
      </View>

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
              description="The link may be broken, or the username has changed"
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
        <ScrollView className="flex-1" contentContainerClassName="flex-grow">
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

            {profile.friendsCount !== null && (
              <ProfileStats
                className="self-stretch"
                stats={[
                  {
                    value: String(profile.friendsCount),
                    label: profile.friendsCount === 1 ? "friend" : "friends",
                  },
                ]}
              />
            )}

            {profile.friendsSince && (
              <Text className="text-center text-sm leading-5 tracking-[0.5px] text-secondary">
                Friends since {formatMonthYear(profile.friendsSince)}
              </Text>
            )}

            {profile.previewOnly && (
              <NoteCard
                className="self-stretch"
                title="This account is private"
                description="Become friends to see their routes, stats and friends"
              />
            )}
          </View>

          <View className="mt-auto px-6 pb-4 pt-6">
            <RelationshipButton profile={profile} />
          </View>
        </ScrollView>
      )}
    </View>
  );
}
