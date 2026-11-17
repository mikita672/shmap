import { Pressable, View } from "react-native";
import { CategoryChip } from "@/components/routes/category-chip";
import { Text } from "@/components/ui/text";
import { MaterialIcons } from "@/lib/icons";
import { countInterests, formatPickedCount } from "@/lib/place-categories";
import type { RouteInterestResponse } from "@/lib/types/api";

export interface InterestsSummaryProps {
  interests: RouteInterestResponse[];
  memberCount?: number;
  onEdit?: () => void;
}

export function InterestsSummary({
  interests,
  memberCount,
  onEdit,
}: InterestsSummaryProps) {
  const counts = countInterests(interests);
  const pickedCount = interests.filter(
    ({ categories }) => categories.length > 0,
  ).length;

  return (
    <View className="gap-2.5">
      <View className="flex-row items-center gap-1.5">
        <Text className="text-sm font-medium leading-5 text-on-surface">
          Interests
        </Text>
        <Text
          numberOfLines={1}
          className="flex-1 text-[13px] leading-[18px] text-on-surface-muted"
        >
          {formatPickedCount(pickedCount, memberCount)}
        </Text>
        {onEdit && (
          <Pressable
            onPress={onEdit}
            accessibilityRole="button"
            accessibilityLabel="Edit my interests"
            hitSlop={8}
            className="flex-row items-center gap-1 active:opacity-70"
          >
            <MaterialIcons
              name="edit"
              size={16}
              className="text-action-foreground dark:text-on-surface"
            />
            <Text className="text-sm font-medium leading-5 text-action-foreground dark:text-on-surface">
              Edit mine
            </Text>
          </Pressable>
        )}
      </View>

      {counts.length > 0 && (
        <View className="flex-row flex-wrap gap-2">
          {counts.map(({ category, count }) => (
            <CategoryChip
              key={category}
              category={category}
              variant="tonal"
              count={count}
            />
          ))}
        </View>
      )}
    </View>
  );
}
