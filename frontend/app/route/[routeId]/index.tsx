import { ActivityIndicator, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Button } from "@/components/ui/button";
import { NoteCard } from "@/components/ui/note-card";
import { Text } from "@/components/ui/text";
import { TitleHeader } from "@/components/ui/title-header";
import { useRoute } from "@/hooks/useRoute";
import { AuthErrorCode } from "@/lib/types/api";
import { getErrorMessage, isErrorCode } from "@/lib/utils/error";

export default function RouteScreen() {
  const { routeId } = useLocalSearchParams<{ routeId: string }>();
  const { data: route, isPending, error, refetch } = useRoute(Number(routeId));
  const isDeleted = isErrorCode(error, AuthErrorCode.ROUTE_NOT_FOUND);

  return (
    <View className="flex-1 bg-background">
      <TitleHeader title={route && !isDeleted ? route.name : "Route"} />

      {isPending ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      ) : isDeleted ? (
        <View className="flex-1 justify-center px-6">
          <NoteCard
            title="This route was deleted"
            description="Someone in the chat deleted it, or you're no longer in this chat"
          />
        </View>
      ) : !route ? (
        <View className="flex-1 items-center justify-center gap-4 px-6">
          <Text className="text-center">
            {getErrorMessage(error, "Couldn't load this route")}
          </Text>
          <Button onPress={() => refetch()}>
            <Text>Retry</Text>
          </Button>
        </View>
      ) : null}
    </View>
  );
}
