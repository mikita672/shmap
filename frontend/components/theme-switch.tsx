import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Platform,
  StyleSheet,
  LayoutChangeEvent,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@/lib/icons";
import { useTheme, type ThemePreference } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

interface ThemeSwitchProps {
  className?: string;
}

const THEME_OPTIONS: {
  key: ThemePreference;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon: keyof typeof Ionicons.glyphMap;
}[] = [
  {
    key: "light",
    label: "Light",
    icon: "sunny-outline",
    activeIcon: "sunny",
  },
  {
    key: "dark",
    label: "Dark",
    icon: "moon-outline",
    activeIcon: "moon",
  },
  {
    key: "auto",
    label: "Auto",
    icon: "phone-portrait-outline",
    activeIcon: "phone-portrait",
  },
];

const TRACK_HEIGHT = 60;
const PADDING = 4;
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

  const prevIndexRef = useRef(selectedIndex);
  const prevTabWidthRef = useRef(0);
  const isInitializedRef = useRef(false);

  const translateX = useSharedValue(0);
  const scaleX = useSharedValue(1);
  const scaleY = useSharedValue(1);

  const tabCount = THEME_OPTIONS.length;
  const availableWidth = Math.max(0, containerWidth - PADDING * 2);
  const tabWidth = containerWidth > 0 ? availableWidth / tabCount : 0;

  const handleLayout = (e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width;
    if (width > 0 && width !== containerWidth) {
      setContainerWidth(width);
    }
  };

  useEffect(() => {
    if (tabWidth <= 0) return;

    const targetX = PADDING + selectedIndex * tabWidth;

    if (!isInitializedRef.current) {
      translateX.value = targetX;
      isInitializedRef.current = true;
      prevIndexRef.current = selectedIndex;
      prevTabWidthRef.current = tabWidth;
      return;
    }

    const prevIndex = prevIndexRef.current;
    const tabWidthChanged = prevTabWidthRef.current !== tabWidth;
    prevTabWidthRef.current = tabWidth;

    if (tabWidthChanged && prevIndex === selectedIndex) {
      translateX.value = targetX;
      return;
    }

    if (prevIndex !== selectedIndex) {
      const distance = Math.abs(selectedIndex - prevIndex);

      const stretchFactor = 1 + Math.min(distance * 0.18, 0.35);
      const squashFactor = 1 - Math.min(distance * 0.1, 0.2);

      scaleX.value = withSequence(
        withTiming(stretchFactor, {
          duration: 65,
          easing: Easing.out(Easing.quad),
        }),
        withTiming(1, { duration: 75, easing: Easing.inOut(Easing.quad) }),
      );

      scaleY.value = withSequence(
        withTiming(squashFactor, {
          duration: 65,
          easing: Easing.out(Easing.quad),
        }),
        withTiming(1, { duration: 75, easing: Easing.inOut(Easing.quad) }),
      );

      translateX.value = withSpring(targetX, {
        stiffness: 280,
        damping: 24,
        mass: 0.45,
      });

      prevIndexRef.current = selectedIndex;
    }
  }, [selectedIndex, tabWidth, translateX, scaleX, scaleY]);

  const pillAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { scaleX: scaleX.value },
        { scaleY: scaleY.value },
      ],
    };
  });

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
      className={cn("w-full bg-surface border border-border/50", className)}
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
          className="bg-primary shadow-sm shadow-black/10"
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
              <Ionicons
                name={isSelected ? option.activeIcon : option.icon}
                size={20}
                className={
                  isSelected
                    ? "text-primary-foreground"
                    : "text-on-surface-muted"
                }
              />
              <Text
                className={cn(
                  "text-xs font-semibold mt-1",
                  isSelected
                    ? "text-primary-foreground"
                    : "text-on-surface-muted",
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
