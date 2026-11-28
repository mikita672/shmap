import { useEffect, useState } from "react";
import { Pressable, View, type ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Link } from "expo-router";
import { Text } from "@/components/ui/text";
import { MAP_DATA_CREDIT } from "@/lib/map-credits";

const VISIBLE_MS = 5000;
const SLIDE_MS = 350;
const LOGO_GAP = 6;

export interface MapCreditProps {
  ready: boolean;
  dismissed: boolean;
  style?: ViewStyle;
}

export function MapCredit({ ready, dismissed, style }: MapCreditProps) {
  const [timedOut, setTimedOut] = useState(false);
  const hidden = dismissed || timedOut;
  const width = useSharedValue(0);
  const shown = useSharedValue(0);

  useEffect(() => {
    if (!ready) return;
    const timer = setTimeout(() => setTimedOut(true), VISIBLE_MS);
    return () => clearTimeout(timer);
  }, [ready]);

  useEffect(() => {
    if (!ready) return;
    shown.set(withTiming(hidden ? 0 : 1, { duration: SLIDE_MS }));
  }, [ready, hidden, shown]);

  const slideStyle = useAnimatedStyle(() => ({
    opacity: width.get() === 0 ? 0 : 1,
    transform: [{ translateX: -(1 - shown.get()) * (width.get() + LOGO_GAP) }],
  }));

  return (
    <View
      className="absolute overflow-hidden"
      style={[{ paddingLeft: LOGO_GAP }, style]}
      pointerEvents={hidden ? "none" : "box-none"}
    >
      <Animated.View
        style={slideStyle}
        onLayout={(event) => width.set(event.nativeEvent.layout.width)}
      >
        <Link href="/map-data" push asChild>
          <Pressable
            hitSlop={8}
            accessibilityRole="link"
            accessibilityLabel={`Map data ${MAP_DATA_CREDIT}`}
            accessibilityHint="Opens map data and licenses"
            className="rounded-md bg-black/45 px-1.5 py-0.5 active:bg-black/60"
          >
            <Text className="text-[11px] leading-[14px] text-map-pin-foreground/90">
              {MAP_DATA_CREDIT}
            </Text>
          </Pressable>
        </Link>
      </Animated.View>
    </View>
  );
}
