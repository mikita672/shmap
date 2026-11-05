import { ActivityIndicator, View, useWindowDimensions } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useSharedValue } from "react-native-reanimated";
import { useLocalSearchParams } from "expo-router";
import { RouteCredit } from "@/components/routes/route-credit";
import { RouteHeader } from "@/components/routes/route-header";
import { RouteMap } from "@/components/routes/route-map";
import { RouteSheet } from "@/components/routes/route-sheet";
import { Button } from "@/components/ui/button";
import { NoteCard } from "@/components/ui/note-card";
import { Text } from "@/components/ui/text";
import { TitleHeader } from "@/components/ui/title-header";
import { chatQueryOptions } from "@/hooks/useChat";
import { useRoute } from "@/hooks/useRoute";
import { getChatTitle } from "@/lib/chat-preview";
import { AuthErrorCode } from "@/lib/types/api";
import { getErrorMessage, isErrorCode } from "@/lib/utils/error";

export default function RouteScreen() {
  const { routeId } = useLocalSearchParams<{ routeId: string }>();
  const { height } = useWindowDimensions();
  const sheetPosition = useSharedValue(height);
  const { data: route, isPending, error, refetch } = useRoute(Number(routeId));
  const { data: chat } = useQuery({
    ...chatQueryOptions(route?.chatId ?? 0),
    enabled: route !== undefined,
  });
  const isDeleted = isErrorCode(error, AuthErrorCode.ROUTE_NOT_FOUND);

  if (route && !isDeleted) {
    return (
      <View className="flex-1 bg-background">
        <RouteMap route={route} />
        <RouteCredit sheetPosition={sheetPosition} />
        <RouteSheet route={route} animatedPosition={sheetPosition} />
        <RouteHeader
          name={route.name}
          chatTitle={chat ? getChatTitle(chat) : undefined}
        />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <TitleHeader title="Route" />

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
      ) : (
        <View className="flex-1 items-center justify-center gap-4 px-6">
          <Text className="text-center">
            {getErrorMessage(error, "Couldn't load this route")}
          </Text>
          <Button onPress={() => refetch()}>
            <Text>Retry</Text>
          </Button>
        </View>
      )}
    </View>
  );
}
