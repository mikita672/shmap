import { ActivityIndicator, FlatList, View } from "react-native";
import { SuggestionRow } from "@/components/friends/suggestion-row";
import { Button } from "@/components/ui/button";
import { NoteCard } from "@/components/ui/note-card";
import { RefreshControl } from "@/components/ui/refresh-control";
import { SectionLabel } from "@/components/ui/section-label";
import { Text } from "@/components/ui/text";
import { useFriendSuggestions } from "@/hooks/useFriendSuggestions";
import { useRefreshByUser } from "@/hooks/useRefreshByUser";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
import { useSentRequests } from "@/hooks/useSentRequests";
import { getErrorMessage } from "@/lib/utils/error";

export function SuggestionsList() {
  const {
    data: suggestions,
    isPending,
    error,
    refetch,
  } = useFriendSuggestions();
  useRefreshOnFocus(refetch);
  const { isRefetchingByUser, refetchByUser } = useRefreshByUser(refetch);
  const { data: sentRequests = [] } = useSentRequests();

  if (isPending) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!suggestions) {
    return (
      <View className="flex-1 items-center justify-center gap-4 px-6">
        <Text className="text-center">
          {getErrorMessage(error, "Couldn't load suggestions")}
        </Text>
        <Button onPress={() => refetch()}>
          <Text>Retry</Text>
        </Button>
      </View>
    );
  }

  const sentByUserId = new Map(
    sentRequests.map((request) => [request.user.id, request]),
  );

  return (
    <FlatList
      data={suggestions}
      keyExtractor={(suggestion) => String(suggestion.user.id)}
      renderItem={({ item }) => (
        <SuggestionRow
          suggestion={item}
          sentRequest={sentByUserId.get(item.user.id)}
        />
      )}
      ListHeaderComponent={
        suggestions.length > 0 ? (
          <SectionLabel title="Suggestions" className="pb-2 pt-4" />
        ) : null
      }
      ListEmptyComponent={
        <NoteCard
          title="No suggestions yet"
          description="Friends of your friends will show up here."
          className="mt-4"
        />
      }
      refreshControl={
        <RefreshControl
          refreshing={isRefetchingByUser}
          onRefresh={refetchByUser}
          className="bg-action text-secondary"
        />
      }
      ItemSeparatorComponent={RowGap}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      contentContainerClassName="px-6 pb-6"
    />
  );
}

function RowGap() {
  return <View className="h-2" />;
}
