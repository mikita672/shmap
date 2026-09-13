import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Pressable,
  Text,
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
import type { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
  const colors = useTabColors();
  const insets = useSafeAreaInsets();

  const [containerWidth, setContainerWidth] = useState(0);
  const prevIndexRef = useRef(state.index);
  const isInitializedRef = useRef(false);

  const translateX = useSharedValue(0);
  const scaleX = useSharedValue(1);
  const scaleY = useSharedValue(1);

  const tabCount = state.routes.length;
  const tabWidth = containerWidth > 0 ? containerWidth / tabCount : 0;

  const handleLayout = (e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width;
    if (width > 0 && width !== containerWidth) {
      setContainerWidth(width);
    }
  };

  useEffect(() => {
    if (tabWidth <= 0) return;

    const targetX = (state.index + 0.5) * tabWidth - BUBBLE_WIDTH / 2;

    if (!isInitializedRef.current) {
      translateX.value = targetX;
      isInitializedRef.current = true;
      prevIndexRef.current = state.index;
      return;
    }

    const prevIndex = prevIndexRef.current;
    if (prevIndex !== state.index) {
      const distance = Math.abs(state.index - prevIndex);

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

      prevIndexRef.current = state.index;
    }
  }, [state.index, tabWidth, translateX, scaleX, scaleY]);

  const bubbleAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { scaleX: scaleX.value },
        { scaleY: scaleY.value },
      ],
    };
  });

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
            bubbleAnimatedStyle,
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
              </View>

              {typeof label === "string" ? (
                <Text
                  style={[
                    styles.label,
                    { color: isFocused ? colors.iconActive : colors.label },
                  ]}
                >
                  {label}
                </Text>
              ) : typeof label === "function" ? (
                label({
                  focused: isFocused,
                  color: isFocused ? colors.iconActive : colors.label,
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
  label: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 2,
  },
});
