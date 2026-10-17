import { ActivityIndicator, SectionList, View } from "react-native";
import { FriendRow } from "@/components/friends/friend-row";
import { Button } from "@/components/ui/button";
import { SectionLabel } from "@/components/ui/section-label";
import { Text } from "@/components/ui/text";
import { useIncomingRequests } from "@/hooks/useIncomingRequests";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
import { getErrorMessage } from "@/lib/utils/error";

export function RequestsList() {
  const { data: incoming, isPending, error, refetch } = useIncomingRequests();
  useRefreshOnFocus(refetch);

  if (isPending) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!incoming) {
    return (
      <View className="flex-1 items-center justify-center gap-4 px-6">
        <Text className="text-center">
          {getErrorMessage(error, "Couldn't load your requests")}
        </Text>
        <Button onPress={() => refetch()}>
          <Text>Retry</Text>
        </Button>
      </View>
    );
  }

  const sections = [
    {
      key: "incoming",
      title: `Incoming · ${incoming.length}`,
      data: incoming,
    },
  ].filter((section) => section.data.length > 0);

  return (
    <SectionList
      sections={sections}
      keyExtractor={(request) => String(request.id)}
      renderItem={({ item: { user } }) => (
        <FriendRow
          variant="request"
          name={`${user.firstName} ${user.lastName}`}
          subtitle={`@${user.username}`}
          avatarUrl={user.avatarUrl}
          onAccept={() => {}}
          onDecline={() => {}}
        />
      )}
      renderSectionHeader={({ section }) => (
        <SectionLabel title={section.title} className="pb-2 pt-4" />
      )}
      stickySectionHeadersEnabled={false}
      ItemSeparatorComponent={RowGap}
      contentContainerClassName="px-6 pb-6"
    />
  );
}

function RowGap() {
  return <View className="h-2" />;
}
