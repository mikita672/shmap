import { useState } from "react";
import {
  Platform,
  Pressable,
  View,
  type LayoutChangeEvent,
} from "react-native";
import Animated from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/text";
import { useSlidingPill } from "@/hooks/useSlidingPill";
import { cn } from "@/lib/utils";

const PADDING = 4;
const GAP = 4;

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
  const [trackWidth, setTrackWidth] = useState(0);

  const selectedIndex = Math.max(
    0,
    segments.findIndex((segment) => segment.value === value),
  );
  const segmentWidth =
    (trackWidth - PADDING * 2 - GAP * (segments.length - 1)) / segments.length;
  const pillStyle = useSlidingPill(
    selectedIndex,
    PADDING + selectedIndex * (segmentWidth + GAP),
  );

  const handleLayout = (event: LayoutChangeEvent) => {
    setTrackWidth(event.nativeEvent.layout.width);
  };

  const handlePress = (next: T) => {
    if (next === value) return;
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    onValueChange(next);
  };

  return (
    <View
      onLayout={handleLayout}
      accessibilityRole="tablist"
      className={cn(
        "h-12 flex-row gap-1 rounded-full bg-action p-1",
        className,
      )}
    >
      {trackWidth > 0 && (
        <Animated.View
          className="absolute left-0 top-1 h-10 rounded-full bg-action-chip"
          style={[{ width: segmentWidth }, pillStyle]}
        />
      )}

      {segments.map((segment) => {
        const isSelected = segment.value === value;

        return (
          <Pressable
            key={segment.value}
            onPress={() => handlePress(segment.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected }}
            className="flex-1 flex-row items-center justify-center gap-2 rounded-full"
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
