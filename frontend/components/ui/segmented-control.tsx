import { Platform, Pressable, View } from "react-native";
import * as Haptics from "expo-haptics";
import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

export interface Segment<T extends string> {
  value: T;
  label: string;
  badge?: number;
}

export interface SegmentedControlProps<T extends string> {
  segments: readonly Segment<T>[];
  value: T;
  onValueChange: (value: T) => void;
  className?: string;
}

export function SegmentedControl<T extends string>({
  segments,
  value,
  onValueChange,
  className,
}: SegmentedControlProps<T>) {
  const handlePress = (next: T) => {
    if (next === value) return;
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    onValueChange(next);
  };

  return (
    <View
      accessibilityRole="tablist"
      className={cn(
        "h-12 flex-row gap-1 rounded-full bg-action p-1",
        className,
      )}
    >
      {segments.map((segment) => {
        const isSelected = segment.value === value;

        return (
          <Pressable
            key={segment.value}
            onPress={() => handlePress(segment.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected }}
            className={cn(
              "flex-1 flex-row items-center justify-center gap-2 rounded-full",
              isSelected && "bg-action-chip",
            )}
          >
            <Text
              className={cn(
                "text-base font-medium leading-6 tracking-[0.5px]",
                isSelected
                  ? "text-action-chip-foreground"
                  : "text-action-foreground",
              )}
            >
              {segment.label}
            </Text>
            {segment.badge !== undefined && <Badge count={segment.badge} />}
          </Pressable>
        );
      })}
    </View>
  );
}
