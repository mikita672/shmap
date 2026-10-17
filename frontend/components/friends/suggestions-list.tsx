import { ActivityIndicator, FlatList, View } from "react-native";
import { SuggestionRow } from "@/components/friends/suggestion-row";
import { Button } from "@/components/ui/button";
import { SectionLabel } from "@/components/ui/section-label";
import { Text } from "@/components/ui/text";
import { useFriendSuggestions } from "@/hooks/useFriendSuggestions";
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
        <SectionLabel title="Suggestions" className="pb-2 pt-4" />
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
