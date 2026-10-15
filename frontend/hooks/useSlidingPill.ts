import { useEffect, useRef } from "react";
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const SLIDE_SPRING = { stiffness: 280, damping: 24, mass: 0.45 };
const DEFORM_TIMING = { duration: 65, easing: Easing.out(Easing.quad) };
const SETTLE_TIMING = { duration: 75, easing: Easing.inOut(Easing.quad) };

export function useSlidingPill(index: number, offset: number) {
  const translateX = useSharedValue(offset);
  const scaleX = useSharedValue(1);
  const scaleY = useSharedValue(1);
  const prevIndexRef = useRef(index);

  useEffect(() => {
    const distance = Math.abs(index - prevIndexRef.current);
    prevIndexRef.current = index;

    if (distance === 0) {
      translateX.set(offset);
      return;
    }

    const stretch = 1 + Math.min(distance * 0.18, 0.35);
    const squash = 1 - Math.min(distance * 0.1, 0.2);

    scaleX.set(
      withSequence(
        withTiming(stretch, DEFORM_TIMING),
        withTiming(1, SETTLE_TIMING),
      ),
    );
    scaleY.set(
      withSequence(
        withTiming(squash, DEFORM_TIMING),
        withTiming(1, SETTLE_TIMING),
      ),
    );
    translateX.set(withSpring(offset, SLIDE_SPRING));
  }, [index, offset, translateX, scaleX, scaleY]);

  return useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.get() },
      { scaleX: scaleX.get() },
      { scaleY: scaleY.get() },
    ],
  }));
}
