import { useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { NewRoutePopup } from "@/components/routes/new-route-popup";
import { RoutesList } from "@/components/routes/routes-list";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { TitleHeader } from "@/components/ui/title-header";
import { useChat } from "@/hooks/useChat";
import { useChatRoutes } from "@/hooks/useChatRoutes";
import { getErrorMessage } from "@/lib/utils/error";

export default function ChatRoutesScreen() {
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: chat } = useChat(Number(chatId));
  const {
    data: routes,
    isPending,
    error,
    refetch,
    dataUpdatedAt,
  } = useChatRoutes(Number(chatId));
  const [isNewRouteOpen, setIsNewRouteOpen] = useState(false);

  const canCreate = chat?.canSend === true;
  const openNewRoute = canCreate ? () => setIsNewRouteOpen(true) : undefined;

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
        <>
          <RoutesList
            routes={routes}
            now={dataUpdatedAt}
            onOpenRoute={openRoute}
            onRefresh={refetch}
            onNewRoute={openNewRoute}
          />
          {canCreate && routes.length > 0 && (
            <View
              className="px-[26px] pt-3"
              style={{ paddingBottom: insets.bottom + 12 }}
            >
              <Button size="xl" onPress={openNewRoute}>
                <Text className="text-2xl">New route</Text>
              </Button>
            </View>
          )}
        </>
      )}

      {chat && (
        <NewRoutePopup
          chat={chat}
          visible={isNewRouteOpen}
          onClose={() => setIsNewRouteOpen(false)}
          onCreated={(route) => {
            setIsNewRouteOpen(false);
            openRoute(route.id);
          }}
        />
      )}
    </View>
  );
}
