import { useState } from "react";
import { ActivityIndicator, View, useWindowDimensions } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useSharedValue } from "react-native-reanimated";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ReadOnlyBar } from "@/components/chats/read-only-bar";
import { RouteActionsMenu } from "@/components/routes/route-actions-menu";
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
import {
  useRemoveStop,
  useReorderStops,
  useRetryPath,
  useSetTravelMode,
} from "@/hooks/useRouteMutations";
import { useStalePathRetry } from "@/hooks/useStalePathRetry";
import { getChatTitle } from "@/lib/chat-preview";
import { openRouteInMaps } from "@/lib/open-route-in-maps";
import { AuthErrorCode } from "@/lib/types/api";
import { getErrorMessage, isErrorCode } from "@/lib/utils/error";

export default function RouteScreen() {
  const { routeId } = useLocalSearchParams<{ routeId: string }>();
  const router = useRouter();
  const { height } = useWindowDimensions();
  const sheetPosition = useSharedValue(height);
  const [selectedStopId, setSelectedStopId] = useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuKey, setMenuKey] = useState(0);
  const { data: route, isPending, error, refetch } = useRoute(Number(routeId));
  const { data: chat } = useQuery({
    ...chatQueryOptions(route?.chatId ?? 0),
    enabled: route !== undefined,
  });
  const setTravelMode = useSetTravelMode(Number(routeId));
  const retryPath = useRetryPath(Number(routeId));
  const removeStop = useRemoveStop(Number(routeId));
  const reorderStops = useReorderStops(Number(routeId));
  useStalePathRetry(route, () => retryPath.mutate());
  const isDeleted = isErrorCode(error, AuthErrorCode.ROUTE_NOT_FOUND);

  if (route && !isDeleted) {
    const canEditPlan = route.canEdit && route.completion === null;

    return (
      <View className="flex-1 bg-background">
        <RouteMap
          route={route}
          selectedStopId={selectedStopId}
          onSelectStop={setSelectedStopId}
        />
        <RouteCredit sheetPosition={sheetPosition} />
        <RouteSheet
          route={route}
          animatedPosition={sheetPosition}
          selectedStopId={selectedStopId}
          onSelectStop={setSelectedStopId}
          onRemoveStop={
            canEditPlan
              ? (stopId) => {
                  setSelectedStopId(null);
                  removeStop.mutate(stopId);
                }
              : undefined
          }
          notice={
            !route.canEdit && chat?.type === "DIRECT" && chat.members[0] ? (
              <ReadOnlyBar
                firstName={chat.members[0].firstName}
                username={chat.members[0].username}
                description={`You can still see this route. Add ${chat.members[0].firstName} as a friend again to plan it together.`}
                className="bg-transparent px-0 pb-0 pt-2"
              />
            ) : undefined
          }
          onReorderStops={
            canEditPlan ? (stopIds) => reorderStops.mutate(stopIds) : undefined
          }
          onAddPlace={
            canEditPlan
              ? () =>
                  router.push({
                    pathname: "/route/[routeId]/add-stop",
                    params: { routeId: String(route.id) },
                  })
              : undefined
          }
          onTravelModeChange={
            canEditPlan ? (mode) => setTravelMode.mutate(mode) : undefined
          }
          onRetryPath={() => retryPath.mutate()}
          onEditCompletion={() =>
            router.push({
              pathname: "/route/[routeId]/done",
              params: { routeId: String(route.id) },
            })
          }
          onOpenInMaps={() => openRouteInMaps(route)}
        />
        <RouteHeader
          name={route.name}
          chatTitle={chat ? getChatTitle(chat) : undefined}
          onMore={() => {
            setMenuKey((key) => key + 1);
            setIsMenuOpen(true);
          }}
        />
        <RouteActionsMenu
          key={menuKey}
          route={route}
          chat={chat}
          visible={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          onDeleted={() => router.back()}
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
