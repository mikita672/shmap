import { SectionList, View } from "react-native";
import { ChatsEmpty } from "@/components/chats/chats-empty";
import { RouteRow } from "@/components/routes/route-row";
import { RefreshControl } from "@/components/ui/refresh-control";
import { SectionLabel } from "@/components/ui/section-label";
import { useRefreshByUser } from "@/hooks/useRefreshByUser";
import type { RouteSummaryResponse } from "@/lib/types/api";
import { cn } from "@/lib/utils";

export interface RoutesListProps {
  routes: RouteSummaryResponse[];
  now: number;
  onOpenRoute: (routeId: number) => void;
  onRefresh: () => Promise<unknown>;
  onNewRoute?: () => void;
}

export function RoutesList({
  routes,
  now,
  onOpenRoute,
  onRefresh,
  onNewRoute,
}: RoutesListProps) {
  const { isRefetchingByUser, refetchByUser } = useRefreshByUser(onRefresh);

  const planned = routes.filter((route) => route.finishedOn === null);
  const done = routes
    .filter((route) => route.finishedOn !== null)
    .sort((a, b) => (b.finishedOn ?? "").localeCompare(a.finishedOn ?? ""));
  const sections = [
    { title: "Planned", data: planned },
    { title: "Done", data: done },
  ].filter((section) => section.data.length > 0);

  return (
    <SectionList
      sections={sections}
      keyExtractor={(route) => String(route.id)}
      renderItem={({ item }) => (
        <RouteRow route={item} now={now} onPress={() => onOpenRoute(item.id)} />
      )}
      renderSectionHeader={({ section }) => (
        <SectionLabel
          title={`${section.title} · ${section.data.length}`}
          className={cn("mb-2", section !== sections[0] && "mt-4")}
        />
      )}
      stickySectionHeadersEnabled={false}
      ListEmptyComponent={
        <ChatsEmpty
          title="No routes yet"
          description="Plan one together: everyone in the chat can add places"
          actionLabel="Start shared route"
          actionIcon="route"
          onAction={onNewRoute}
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
