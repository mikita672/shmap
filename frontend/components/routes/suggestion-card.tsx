import { ActivityIndicator, Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";
import { MaterialIcons } from "@/lib/icons";
import { PLACE_CATEGORY_INFO } from "@/lib/place-categories";
import type { RouteSuggestionResponse } from "@/lib/types/api";
import { cn } from "@/lib/utils";

export interface SuggestionCardProps {
  suggestion: RouteSuggestionResponse;
  onPress?: () => void;
  onAdd?: () => void;
  isAdding?: boolean;
  addDisabled?: boolean;
  className?: string;
}

export function SuggestionCard({
  suggestion,
  onPress,
  onAdd,
  isAdding = false,
  addDisabled = false,
  className,
}: SuggestionCardProps) {
  const { place, category, reason } = suggestion;
  const { label, icon } = PLACE_CATEGORY_INFO[category];
  const meta = place.address ? `${label} · ${place.address}` : label;

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? "button" : undefined}
      className={cn(
        "flex-row items-start gap-3 rounded-2xl bg-action p-3 active:opacity-80 dark:bg-on-surface/10",
        className,
      )}
    >
      <View className="h-10 w-10 items-center justify-center rounded-full bg-surface">
        <MaterialIcons name={icon} size={20} className="text-on-surface" />
      </View>

      <View className="min-w-0 flex-1 gap-0.5">
        <Text
          numberOfLines={2}
          className="text-base font-medium leading-5 text-on-surface"
        >
          {place.name}
        </Text>
        <Text
          numberOfLines={1}
          className="text-[13px] leading-[18px] text-on-surface-muted"
        >
          {meta}
        </Text>
        <Text className="text-sm leading-5 text-secondary dark:text-on-surface">
          {reason}
        </Text>
      </View>

      {onAdd && (
        <Pressable
          onPress={onAdd}
          disabled={isAdding || addDisabled}
          accessibilityRole="button"
          accessibilityLabel={`Add ${place.name} to the route`}
          accessibilityState={{ disabled: addDisabled, busy: isAdding }}
          className={cn(
            "h-8 flex-row items-center gap-1 rounded-full bg-primary pl-2.5 pr-3 active:opacity-80",
            addDisabled && !isAdding && "opacity-40",
          )}
        >
          {isAdding ? (
            <ActivityIndicator
              size="small"
              className="h-4 w-4 text-primary-foreground"
            />
          ) : (
            <MaterialIcons
              name="add"
              size={16}
              className="text-primary-foreground"
            />
          )}
          <Text className="text-sm font-medium leading-5 text-primary-foreground">
            {isAdding ? "Adding" : "Add"}
          </Text>
        </Pressable>
      )}
    </Pressable>
  );
}
