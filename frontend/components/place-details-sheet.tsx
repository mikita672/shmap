import React, { useEffect, useCallback, type ReactNode } from "react";
import { View } from "react-native";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedReaction,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@/lib/icons";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CopyPlaceButton, SharePlaceButton } from "@/components/place-actions";
import {
  PlaceAddress,
  PlaceCategoryIcon,
  PlaceHeader,
} from "@/components/place-info";
import type { PlaceDetails } from "@/lib/api/geocoding";

function DragHandle() {
  return (
    <View className="items-center pt-2 pb-1">
      <View className="w-10 h-1 rounded-full bg-on-surface-muted/30" />
    </View>
  );
}

function SkeletonBlock({ className }: { className?: string }) {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.4, { duration: 700 }),
        withTiming(1, { duration: 700 }),
      ),
      -1,
    );
  }, [opacity]);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={style}
      className={`bg-on-surface-muted/20 rounded-lg ${className ?? ""}`}
    />
  );
}

function LoadingSkeleton() {
  return (
    <View className="px-5 pb-4 pt-2 gap-3">
      <View className="flex-row items-center gap-3">
        <SkeletonBlock className="w-10 h-10 rounded-full" />
        <View className="flex-1 gap-2">
          <SkeletonBlock className="h-5 w-3/4" />
          <SkeletonBlock className="h-3 w-1/3" />
        </View>
      </View>
      <Separator />

      <SkeletonBlock className="h-4 w-full" />
      <SkeletonBlock className="h-4 w-2/3" />
      <Separator />
      <View className="flex-row gap-3">
        <SkeletonBlock className="flex-1 h-10 rounded-xl" />
        <SkeletonBlock className="flex-1 h-10 rounded-xl" />
      </View>
    </View>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <View className="px-5 pb-6 pt-2 items-center gap-4">
      <Ionicons
        name="alert-circle-outline"
        size={36}
        className="text-destructive"
      />
      <Text className="text-on-surface-muted text-sm text-center">
        Could not load place details.{"\n"}Check your connection and try again.
      </Text>
      <Button variant="outline" onPress={onRetry}>
        <Text>Retry</Text>
      </Button>
    </View>
  );
}

function PlaceContent({
  place,
  onClose,
  renderActions,
  renderPrimaryAction,
}: {
  place: PlaceDetails;
  onClose: () => void;
  renderActions: (place: PlaceDetails) => ReactNode;
  renderPrimaryAction?: (place: PlaceDetails) => ReactNode;
}) {
  return (
    <View className="px-5 pb-4 pt-1 gap-3">
      <PlaceHeader
        place={place}
        leading={<PlaceCategoryIcon place={place} />}
        onClose={onClose}
      />

      <Separator />

      <PlaceAddress place={place} />

      <Separator />

      {renderPrimaryAction?.(place)}

      <View className="flex-row gap-3">{renderActions(place)}</View>
    </View>
  );
}

function defaultActions(place: PlaceDetails) {
  return (
    <>
      <CopyPlaceButton place={place} />
      <SharePlaceButton place={place} />
    </>
  );
}

export interface PlaceDetailsSheetProps {
  visible: boolean;
  place: PlaceDetails | null;
  isLoading: boolean;
  isError: boolean;
  onClose: () => void;
  onRetry: () => void;
  renderActions?: (place: PlaceDetails) => ReactNode;
  renderPrimaryAction?: (place: PlaceDetails) => ReactNode;
  opensExpanded?: boolean;
  animatedBottomOffset?: import("react-native-reanimated").SharedValue<number>;
}

const MINIMIZED_HEIGHT = 140;
const springConfig = { damping: 20, stiffness: 200, mass: 0.8 };

const getMinimizedY = (h: number) => {
  "worklet";
  return Math.max(0, h - MINIMIZED_HEIGHT);
};

export function PlaceDetailsSheet({
  visible,
  place,
  isLoading,
  isError,
  onClose,
  onRetry,
  renderActions = defaultActions,
  renderPrimaryAction,
  opensExpanded = false,
  animatedBottomOffset,
}: PlaceDetailsSheetProps) {
  const insets = useSafeAreaInsets();

  const sheetHeight = useSharedValue(0);
  const translateY = useSharedValue(1000);
  const contextY = useSharedValue(0);

  const snapTo = useCallback(
    (destination: number) => {
      "worklet";
      translateY.set(withSpring(destination, springConfig));
    },
    [translateY],
  );

  useAnimatedReaction(
    () => {
      return {
        h: sheetHeight.value,
        y: translateY.value,
      };
    },
    (curr, prev) => {
      const visibleHeight = Math.max(0, curr.h - curr.y);
      if (animatedBottomOffset) {
        animatedBottomOffset.set(visibleHeight);
      }

      if (
        visible &&
        !opensExpanded &&
        prev &&
        curr.h !== prev.h &&
        curr.h > 0 &&
        prev.h > 0
      ) {
        const wasMinimized = Math.abs(prev.y - getMinimizedY(prev.h)) < 1;
        if (wasMinimized) {
          snapTo(getMinimizedY(curr.h));
        }
      }
    },
    [visible, opensExpanded],
  );

  useEffect(() => {
    if (visible) {
      if (sheetHeight.get() > 0) {
        snapTo(opensExpanded ? 0 : getMinimizedY(sheetHeight.get()));
      }
    } else {
      const h = sheetHeight.get() > 0 ? sheetHeight.get() : 1000;
      translateY.set(withTiming(h, { duration: 250 }));
    }
  }, [visible, opensExpanded, sheetHeight, snapTo, translateY]);

  const gesture = Gesture.Pan()
    .onStart(() => {
      contextY.set(translateY.value);
    })
    .onUpdate((event) => {
      const minimizedY = getMinimizedY(sheetHeight.value);
      const newY = contextY.value + event.translationY;

      if (newY > minimizedY) {
        const overscroll = newY - minimizedY;
        const frictionY = minimizedY + overscroll * 0.2;
        translateY.set(Math.max(0, frictionY));
      } else {
        translateY.set(Math.max(0, newY));
      }
    })
    .onEnd((event) => {
      const velocityY = event.velocityY;
      const currentY = translateY.value;
      const minimizedY = getMinimizedY(sheetHeight.value);

      const projectedY = currentY + velocityY * 0.2;

      if (projectedY < minimizedY / 2) {
        snapTo(0);
      } else {
        snapTo(minimizedY);
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          sheetStyle,
          {
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
          },
        ]}
        onLayout={(e) => {
          const h = e.nativeEvent.layout.height;
          const isFirstMeasure = sheetHeight.value === 0;
          sheetHeight.set(h);

          if (isFirstMeasure) {
            if (visible) {
              translateY.set(h);
              snapTo(opensExpanded ? 0 : getMinimizedY(h));
            } else {
              translateY.set(h);
            }
          }
        }}
      >
        <View
          className="bg-surface rounded-t-3xl shadow-xl shadow-black/20 elevation-8"
          style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        >
          <DragHandle />

          {isLoading && !place ? (
            <LoadingSkeleton />
          ) : isError ? (
            <ErrorState onRetry={onRetry} />
          ) : place ? (
            <PlaceContent
              place={place}
              onClose={onClose}
              renderActions={renderActions}
              renderPrimaryAction={renderPrimaryAction}
            />
          ) : null}
        </View>
      </Animated.View>
    </GestureDetector>
  );
}
