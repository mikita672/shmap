import { ActivityIndicator, SectionList, View } from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import { ActivityItem } from "@/components/friends/activity-item";
import { IncomingRequestRow } from "@/components/friends/incoming-request-row";
import { SentRequestRow } from "@/components/friends/sent-request-row";
import { Button } from "@/components/ui/button";
import { SectionLabel } from "@/components/ui/section-label";
import { Text } from "@/components/ui/text";
import {
  friendActivityQueryOptions,
  useFriendActivity,
} from "@/hooks/useFriendActivity";
import { useIncomingRequests } from "@/hooks/useIncomingRequests";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
import { useSentRequests } from "@/hooks/useSentRequests";
import type {
  FriendActivityResponse,
  FriendActivityType,
  FriendRequestResponse,
} from "@/lib/types/api";
import { getErrorMessage } from "@/lib/utils/error";

type RequestsRow =
  | { key: string; kind: "incoming"; request: FriendRequestResponse }
  | { key: string; kind: "sent"; request: FriendRequestResponse }
  | { key: string; kind: "activity"; activity: FriendActivityResponse };

interface RequestsSection {
  key: string;
  title: string;
  data: RequestsRow[];
}

const ACTIVITY_ACTIONS: Record<FriendActivityType, string> = {
  REQUEST_ACCEPTED: "accepted your request",
  NEW_FRIENDSHIP: "is now your friend",
};

export function RequestsList() {
  const queryClient = useQueryClient();
  const incoming = useIncomingRequests();
  const sent = useSentRequests();
  const activity = useFriendActivity();
  useRefreshOnFocus(incoming.refetch);
  useRefreshOnFocus(sent.refetch);
  useRefreshOnFocus(activity.refetch);

  const refreshAll = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ["friend-requests"] }),
      queryClient.invalidateQueries({
        queryKey: friendActivityQueryOptions.queryKey,
      }),
    ]);

  if (incoming.isPending || sent.isPending || activity.isPending) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!incoming.data || !sent.data || !activity.data) {
    return (
      <View className="flex-1 items-center justify-center gap-4 px-6">
        <Text className="text-center">
          {getErrorMessage(
            incoming.error ?? sent.error ?? activity.error,
            "Couldn't load your requests",
          )}
        </Text>
        <Button onPress={() => refreshAll()}>
          <Text>Retry</Text>
        </Button>
      </View>
    );
  }

  const sections: RequestsSection[] = [
    {
      key: "incoming",
      title: `Incoming · ${incoming.data.length}`,
      data: incoming.data.map((request) => ({
        key: `incoming-${request.id}`,
        kind: "incoming",
        request,
      })),
    },
    {
      key: "sent",
      title: `Sent · ${sent.data.length}`,
      data: sent.data.map((request) => ({
        key: `sent-${request.id}`,
        kind: "sent",
        request,
      })),
    },
    {
      key: "activity",
      title: "Recent activity",
      data: activity.data.map((item) => ({
        key: `activity-${item.id}`,
        kind: "activity",
        activity: item,
      })),
    },
  ];

  return (
    <SectionList
      sections={sections.filter((section) => section.data.length > 0)}
      keyExtractor={(row) => row.key}
      renderItem={({ item }) => <RequestsListRow row={item} />}
      renderSectionHeader={({ section }) => (
        <SectionLabel title={section.title} className="pb-2 pt-4" />
      )}
      stickySectionHeadersEnabled={false}
      ItemSeparatorComponent={RowGap}
      contentContainerClassName="px-6 pb-6"
    />
  );
}

function RequestsListRow({ row }: { row: RequestsRow }) {
  switch (row.kind) {
    case "incoming":
      return <IncomingRequestRow request={row.request} />;
    case "sent":
      return <SentRequestRow request={row.request} />;
    case "activity": {
      const { user, type } = row.activity;
      return (
        <ActivityItem
          name={`${user.firstName} ${user.lastName}`}
          action={ACTIVITY_ACTIONS[type]}
          avatarUrl={user.avatarUrl}
        />
      );
    }
    default:
      return row satisfies never;
  }
}

function RowGap() {
  return <View className="h-2" />;
}
