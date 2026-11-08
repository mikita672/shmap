import React, { useState } from "react";
import {
  View,
  Pressable,
  Text,
  StyleSheet,
  LayoutChangeEvent,
} from "react-native";
import Animated from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import type { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Badge } from "@/components/ui/badge";
import { useSlidingPill } from "@/hooks/useSlidingPill";
import { useTabColors } from "@/hooks/useTabColors";

type TabBarProps = Parameters<
  NonNullable<React.ComponentProps<typeof Tabs>["tabBar"]>
>[0];

const BUBBLE_WIDTH = 56;
const BUBBLE_HEIGHT = 32;
const BUBBLE_RADIUS = 16;

export function AnimatedTabBar({
  state,
  descriptors,
  navigation,
}: TabBarProps) {
  const focusedRouteName = state.routes[state.index].name;
  const colors = useTabColors(
    focusedRouteName === "friends" || focusedRouteName === "chats"
      ? "contrast"
      : "default",
  );
  const insets = useSafeAreaInsets();

  const [containerWidth, setContainerWidth] = useState(0);

  const tabCount = state.routes.length;
  const tabWidth = containerWidth > 0 ? containerWidth / tabCount : 0;

  const handleLayout = (e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width;
    if (width > 0 && width !== containerWidth) {
      setContainerWidth(width);
    }
  };

  const bubbleStyle = useSlidingPill(
    state.index,
    (state.index + 0.5) * tabWidth - BUBBLE_WIDTH / 2,
  );

  const bottomPadding = Math.max(insets.bottom, 8);

  return (
    <View
      onLayout={handleLayout}
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          paddingBottom: bottomPadding,
        },
      ]}
    >
      {containerWidth > 0 && (
        <Animated.View
          style={[
            styles.bubble,
            { backgroundColor: colors.bubble },
            bubbleStyle,
          ]}
        />
      )}

      <View style={styles.tabsRow}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name;

          const onPress = () => {
            if (
              process.env.EXPO_OS === "ios" ||
              process.env.EXPO_OS === "android"
            ) {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }

            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          const activeColor = colors.iconActive;
          const inactiveColor = colors.icon;
          const iconColor = isFocused ? activeColor : inactiveColor;

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={(options as any).tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              android_ripple={null}
              style={styles.tabItem}
            >
              <View style={styles.iconContainer}>
                {options.tabBarIcon &&
                  options.tabBarIcon({
                    focused: isFocused,
                    color: iconColor,
                    size: 24,
                  })}
                {typeof options.tabBarBadge === "number" && (
                  <View
                    style={[
                      styles.badgeRing,
                      { borderColor: colors.background },
                    ]}
                  >
                    <Badge count={options.tabBarBadge} />
                  </View>
                )}
              </View>

              {typeof label === "string" ? (
                <Text
                  style={[
                    styles.label,
                    { color: isFocused ? colors.labelActive : colors.label },
                  ]}
                >
                  {label}
                </Text>
              ) : typeof label === "function" ? (
                label({
                  focused: isFocused,
                  color: isFocused ? colors.labelActive : colors.label,
                  position: "below-icon",
                  children: route.name,
                })
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    paddingTop: 6,
    position: "relative",
  },
  bubble: {
    position: "absolute",
    top: 6,
    left: 0,
    width: BUBBLE_WIDTH,
    height: BUBBLE_HEIGHT,
    borderRadius: BUBBLE_RADIUS,
    zIndex: 0,
  },
  tabsRow: {
    flexDirection: "row",
    height: 48,
    zIndex: 1,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    width: BUBBLE_WIDTH,
    height: BUBBLE_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeRing: {
    position: "absolute",
    left: 28,
    top: -6,
    borderWidth: 2,
    borderRadius: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 2,
  },
});
