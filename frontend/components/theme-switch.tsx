import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Platform,
  StyleSheet,
  LayoutChangeEvent,
} from "react-native";
import Animated from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { MaterialIcons } from "@/lib/icons";
import { useTheme, type ThemePreference } from "@/hooks/useTheme";
import { useSlidingPill } from "@/hooks/useSlidingPill";
import { cn } from "@/lib/utils";

interface ThemeSwitchProps {
  className?: string;
}

const THEME_OPTIONS: {
  key: ThemePreference;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
}[] = [
  { key: "light", label: "Light", icon: "light-mode" },
  { key: "dark", label: "Dark", icon: "dark-mode" },
  { key: "auto", label: "Auto", icon: "smartphone" },
];

const TRACK_HEIGHT = 60;
const PADDING = 4;
const GAP = 4;
const PILL_HEIGHT = TRACK_HEIGHT - PADDING * 2;
const PILL_RADIUS = PILL_HEIGHT / 2;
const TRACK_RADIUS = TRACK_HEIGHT / 2;

export function ThemeSwitch({ className }: ThemeSwitchProps) {
  const { themePreference, setThemePreference } = useTheme();

  const [containerWidth, setContainerWidth] = useState(0);

  const selectedIndex = Math.max(
    0,
    THEME_OPTIONS.findIndex((opt) => opt.key === themePreference),
  );

  const tabCount = THEME_OPTIONS.length;
  const availableWidth = Math.max(0, containerWidth - PADDING * 2);
  const tabWidth =
    containerWidth > 0 ? (availableWidth - GAP * (tabCount - 1)) / tabCount : 0;

  const pillAnimatedStyle = useSlidingPill(
    selectedIndex,
    PADDING + selectedIndex * (tabWidth + GAP),
  );

  const handleLayout = (e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width;
    if (width > 0 && width !== containerWidth) {
      setContainerWidth(width);
    }
  };

  const handleSelect = (key: ThemePreference) => {
    if (key === themePreference) return;

    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }

    setThemePreference(key);
  };

  return (
    <View
      onLayout={handleLayout}
      style={styles.track}
      className={cn("w-full bg-action", className)}
    >
      {containerWidth > 0 && (
        <Animated.View
          style={[
            styles.pill,
            {
              width: tabWidth,
            },
            pillAnimatedStyle,
          ]}
          className="bg-action-chip"
        />
      )}

      <View style={styles.tabsRow}>
        {THEME_OPTIONS.map((option) => {
          const isSelected = themePreference === option.key;

          return (
            <Pressable
              key={option.key}
              onPress={() => handleSelect(option.key)}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`${option.label} theme`}
              style={styles.tabItem}
            >
              <MaterialIcons
                name={option.icon}
                size={20}
                className={
                  isSelected
                    ? "text-action-chip-foreground"
                    : "text-action-foreground"
                }
              />
              <Text
                className={cn(
                  "text-xs mt-0.5",
                  isSelected
                    ? "font-medium text-action-chip-foreground"
                    : "text-action-foreground",
                )}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    position: "relative",
    height: TRACK_HEIGHT,
    borderRadius: TRACK_RADIUS,
    justifyContent: "center",
    overflow: "hidden",
  },
  pill: {
    position: "absolute",
    top: PADDING,
    left: 0,
    height: PILL_HEIGHT,
    borderRadius: PILL_RADIUS,
    zIndex: 0,
  },
  tabsRow: {
    flexDirection: "row",
    paddingHorizontal: PADDING,
    gap: GAP,
    height: PILL_HEIGHT,
    zIndex: 1,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: PILL_HEIGHT,
  },
});
