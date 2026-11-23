import { View } from "react-native";
import { PlaceAddress } from "@/components/place-info";
import { AddPlaceButton } from "@/components/routes/add-place-button";
import { CategoryChip } from "@/components/routes/category-chip";
import { SuggestionPin } from "@/components/routes/suggestion-pin";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { toPlaceDetails } from "@/lib/chat-place";
import { Ionicons, MaterialIcons } from "@/lib/icons";
import type { RouteSuggestionResponse } from "@/lib/types/api";

export interface SuggestionDetailsProps {
  suggestion: RouteSuggestionResponse;
  onClose: () => void;
  onAdd?: () => void;
  isAdding?: boolean;
  isFull?: boolean;
}

export function SuggestionDetails({
  suggestion,
  onClose,
  onAdd,
  isAdding = false,
  isFull = false,
}: SuggestionDetailsProps) {
  const { place, category, reason } = suggestion;

  return (
    <View className="gap-3">
      <View className="flex-row items-start gap-3">
        <SuggestionPin category={category} selected />
        <View className="min-w-0 flex-1 items-start gap-1">
          <Text
            numberOfLines={2}
            className="text-base font-semibold leading-5 text-on-surface"
          >
            {place.name}
          </Text>
          <CategoryChip category={category} variant="tonal" />
        </View>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onPress={onClose}
          accessibilityLabel="Back to suggestions"
        >
          <Ionicons name="close" size={18} className="text-on-surface-muted" />
        </Button>
      </View>

      <View className="h-px bg-on-surface-muted/25" />

      <PlaceAddress place={toPlaceDetails(place)} />

      <View className="h-px bg-on-surface-muted/25" />

      <View className="flex-row items-start gap-3">
        <MaterialIcons
          name="auto-awesome"
          size={18}
          className="text-brand dark:text-on-surface"
        />
        <View className="flex-1 gap-0.5">
          <Text className="text-sm font-medium leading-5 text-on-surface">
            Why AI picked it
          </Text>
          <Text className="text-sm leading-5 text-secondary dark:text-on-surface">
            {reason}
          </Text>
        </View>
      </View>

      {onAdd && (
        <>
          <View className="h-px bg-on-surface-muted/25" />
          <AddPlaceButton
            label={isAdding ? "Adding…" : "Add to route"}
            isFull={isFull}
            disabled={isAdding}
            onPress={onAdd}
          />
        </>
      )}
    </View>
  );
}
