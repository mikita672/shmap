import { ActivityIndicator, FlatList, View } from "react-native";
import { SearchResultRow } from "@/components/friends/search-result-row";
import { Button } from "@/components/ui/button";
import { NoteCard } from "@/components/ui/note-card";
import { Text } from "@/components/ui/text";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
import { useUserSearch } from "@/hooks/useUserSearch";
import { cn } from "@/lib/utils";
import { getErrorMessage } from "@/lib/utils/error";

export interface SearchResultsListProps {
  query: string;
}

export function SearchResultsList({ query }: SearchResultsListProps) {
  const {
    data: results,
    isPending,
    isPlaceholderData,
    error,
    refetch,
  } = useUserSearch(query);
  useRefreshOnFocus(refetch);

  if (isPending) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!results) {
    return (
      <View className="flex-1 items-center justify-center gap-4 px-6">
        <Text className="text-center">
          {getErrorMessage(error, "Couldn't search for people")}
        </Text>
        <Button onPress={() => refetch()}>
          <Text>Retry</Text>
        </Button>
      </View>
    );
  }

  return (
    <FlatList
      data={results}
      className={cn(isPlaceholderData && "opacity-60")}
      keyExtractor={(result) => String(result.user.id)}
      renderItem={({ item }) => <SearchResultRow result={item} />}
      ListEmptyComponent={
        <NoteCard
          title="No people found"
          description="Try another name or @username."
        />
      }
      ItemSeparatorComponent={RowGap}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      contentContainerClassName="px-6 pb-6 pt-4"
    />
  );
}

function RowGap() {
  return <View className="h-2" />;
}
