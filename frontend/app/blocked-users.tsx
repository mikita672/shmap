import { ActivityIndicator, View } from "react-native";
import { BlockedUsersList } from "@/components/settings/blocked-users-list";
import { Button } from "@/components/ui/button";
import { ScreenHeader } from "@/components/ui/screen-header";
import { Text } from "@/components/ui/text";
import { useBlockedUsers } from "@/hooks/useBlockedUsers";
import { getErrorMessage } from "@/lib/utils/error";

export default function BlockedUsersScreen() {
  const { data: blockedUsers, isPending, error, refetch } = useBlockedUsers();

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Blocked users" />

      {isPending ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      ) : !blockedUsers ? (
        <View className="flex-1 items-center justify-center gap-4 px-6">
          <Text className="text-center">
            {getErrorMessage(error, "Couldn't load blocked users")}
          </Text>
          <Button onPress={() => refetch()}>
            <Text>Retry</Text>
          </Button>
        </View>
      ) : (
        <BlockedUsersList blockedUsers={blockedUsers} onRefresh={refetch} />
      )}
    </View>
  );
}
