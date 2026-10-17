import { ActivityIndicator, FlatList, View } from "react-native";
import { FriendRow } from "@/components/friends/friend-row";
import { Button } from "@/components/ui/button";
import { SectionLabel } from "@/components/ui/section-label";
import { Text } from "@/components/ui/text";
import { useFriendSuggestions } from "@/hooks/useFriendSuggestions";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
import { mutualFriendsSubtitle } from "@/lib/mutual-friends";
import { getErrorMessage } from "@/lib/utils/error";

export function SuggestionsList() {
  const {
    data: suggestions,
    isPending,
    error,
    refetch,
  } = useFriendSuggestions();
  useRefreshOnFocus(refetch);

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

  return (
    <FlatList
      data={suggestions}
      keyExtractor={(suggestion) => String(suggestion.user.id)}
      renderItem={({ item: suggestion }) => (
        <FriendRow
          variant="suggestion"
          name={`${suggestion.user.firstName} ${suggestion.user.lastName}`}
          subtitle={mutualFriendsSubtitle(suggestion)}
          avatarUrl={suggestion.user.avatarUrl}
          onAdd={() => {}}
          onDismiss={() => {}}
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
