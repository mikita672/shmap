import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";
import { MaterialIcons } from "@/lib/icons";
import { PLACE_CATEGORY_INFO } from "@/lib/place-categories";
import type { RouteSuggestionResponse } from "@/lib/types/api";
import { cn } from "@/lib/utils";

export interface SuggestionCardProps {
  suggestion: RouteSuggestionResponse;
  onPress?: () => void;
  className?: string;
}

export function SuggestionCard({
  suggestion,
  onPress,
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
    </Pressable>
  );
}
