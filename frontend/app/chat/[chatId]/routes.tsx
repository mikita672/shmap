import { ActivityIndicator, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { RoutesList } from "@/components/routes/routes-list";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { TitleHeader } from "@/components/ui/title-header";
import { useChat } from "@/hooks/useChat";
import { useChatRoutes } from "@/hooks/useChatRoutes";
import { getChatTitle } from "@/lib/chat-preview";
import { getErrorMessage } from "@/lib/utils/error";

export default function ChatRoutesScreen() {
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const router = useRouter();
  const { data: chat } = useChat(Number(chatId));
  const {
    data: routes,
    isPending,
    error,
    refetch,
    dataUpdatedAt,
  } = useChatRoutes(Number(chatId));

  const openRoute = (routeId: number) => {
    router.push({
      pathname: "/route/[routeId]",
      params: { routeId: String(routeId) },
    });
  };

  return (
    <View className="flex-1 bg-background">
      <TitleHeader title="Routes" />

      {isPending ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      ) : !routes ? (
        <View className="flex-1 items-center justify-center gap-4 px-6">
          <Text className="text-center">
            {getErrorMessage(error, "Couldn't load routes")}
          </Text>
          <Button onPress={() => refetch()}>
            <Text>Retry</Text>
          </Button>
        </View>
      ) : (
        <RoutesList
          routes={routes}
          chatTitle={chat ? getChatTitle(chat) : undefined}
          now={dataUpdatedAt}
          onOpenRoute={openRoute}
          onRefresh={refetch}
        />
      )}
    </View>
  );
}
