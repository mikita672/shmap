import React from "react";
import { View, Text, Pressable, Platform } from "react-native";
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

export function ThemeSwitch({ className }: ThemeSwitchProps) {
  const { themePreference, setThemePreference } = useTheme();

  const handleSelect = (key: ThemePreference) => {
    if (key === themePreference) return;

    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }

    setThemePreference(key);
  };

  return (
    <View
      className={cn(
        "flex-row items-center justify-between rounded-full border border-border bg-surface p-1.5",
        className,
      )}
    >
      {THEME_OPTIONS.map((option) => {
        const isSelected = themePreference === option.key;

        return (
          <Pressable
            key={option.key}
            onPress={() => handleSelect(option.key)}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={`${option.label} theme`}
            className={cn(
              "flex-1 flex-row items-center justify-center gap-1.5 rounded-full px-3 py-2.5 transition-all",
              isSelected
                ? "bg-primary shadow-sm shadow-black/10"
                : "bg-transparent active:opacity-70",
            )}
          >
            <Ionicons
              name={isSelected ? option.activeIcon : option.icon}
              size={17}
              className={
                isSelected ? "text-primary-foreground" : "text-on-surface-muted"
              }
            />
            <Text
              className={cn(
                "text-sm font-medium",
                isSelected
                  ? "font-semibold text-primary-foreground"
                  : "text-on-surface-muted",
              )}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
