import { Platform, Pressable, View } from "react-native";
import Animated from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useSlidingPill } from "@/hooks/useSlidingPill";
import { MaterialIcons, type MaterialIconName } from "@/lib/icons";
import { TRAVEL_MODE_LABELS } from "@/lib/route-format";
import type { TravelMode } from "@/lib/types/api";
import { cn } from "@/lib/utils";

const PADDING = 3;
const GAP = 2;
const SEGMENT_WIDTH = 48;

const MODES: readonly { value: TravelMode; icon: MaterialIconName }[] = [
  { value: "WALKING", icon: "directions-walk" },
  { value: "DRIVING", icon: "directions-car" },
];

export interface TravelModeSwitchProps {
  value: TravelMode;
  onValueChange?: (value: TravelMode) => void;
  className?: string;
}

export function TravelModeSwitch({
  value,
  onValueChange,
  className,
}: TravelModeSwitchProps) {
  const selectedIndex = Math.max(
    0,
    MODES.findIndex((mode) => mode.value === value),
  );
  const pillStyle = useSlidingPill(
    selectedIndex,
    PADDING + selectedIndex * (SEGMENT_WIDTH + GAP),
  );
  const disabled = !onValueChange;

  const handlePress = (next: TravelMode) => {
    if (next === value || !onValueChange) return;
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    onValueChange(next);
  };

  return (
    <View
      accessibilityRole="tablist"
      className={cn(
        "flex-row gap-0.5 self-start rounded-full bg-action p-[3px]",
        disabled && "opacity-50",
        className,
      )}
    >
      <Animated.View
        className="absolute left-0 top-[3px] h-9 w-12 rounded-full bg-action-chip"
        style={pillStyle}
      />

      {MODES.map((mode) => {
        const isSelected = mode.value === value;

        return (
          <Pressable
            key={mode.value}
            onPress={() => handlePress(mode.value)}
            disabled={disabled}
            accessibilityRole="tab"
            accessibilityLabel={TRAVEL_MODE_LABELS[mode.value]}
            accessibilityState={{ selected: isSelected, disabled }}
            className="h-9 w-12 items-center justify-center rounded-full"
          >
            <MaterialIcons
              name={mode.icon}
              size={20}
              className={
                isSelected
                  ? "text-action-chip-foreground"
                  : "text-action-foreground"
              }
            />
          </Pressable>
        );
      })}
    </View>
  );
}
