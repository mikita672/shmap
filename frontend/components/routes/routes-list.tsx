import { FlatList, View } from "react-native";
import { ChatsEmpty } from "@/components/chats/chats-empty";
import { RouteRow } from "@/components/routes/route-row";
import { RefreshControl } from "@/components/ui/refresh-control";
import { SectionLabel } from "@/components/ui/section-label";
import { useRefreshByUser } from "@/hooks/useRefreshByUser";
import { formatRouteCount, joinMeta } from "@/lib/route-format";
import type { RouteSummaryResponse } from "@/lib/types/api";

export interface RoutesListProps {
  routes: RouteSummaryResponse[];
  chatTitle?: string;
  now: number;
  onOpenRoute: (routeId: number) => void;
  onRefresh: () => Promise<unknown>;
}

export function RoutesList({
  routes,
  chatTitle,
  now,
  onOpenRoute,
  onRefresh,
}: RoutesListProps) {
  const { isRefetchingByUser, refetchByUser } = useRefreshByUser(onRefresh);

  return (
    <FlatList
      data={routes}
      keyExtractor={(route) => String(route.id)}
      renderItem={({ item }) => (
        <RouteRow route={item} now={now} onPress={() => onOpenRoute(item.id)} />
      )}
      ListHeaderComponent={
        routes.length > 0 ? (
          <SectionLabel
            title={joinMeta(chatTitle, formatRouteCount(routes.length))}
            className="mb-2"
          />
        ) : null
      }
      ListEmptyComponent={
        <ChatsEmpty
          title="No routes yet"
          description="Plan one together: everyone in the chat can add places"
          actionLabel="Start shared route"
          actionIcon="route"
        />
      }
      ItemSeparatorComponent={RowGap}
      refreshControl={
        <RefreshControl
          refreshing={isRefetchingByUser}
          onRefresh={refetchByUser}
          className="bg-action text-secondary"
        />
      }
      contentContainerClassName="grow px-[26px] pb-6 pt-2"
    />
  );
}

function RowGap() {
  return <View className="h-2" />;
}
