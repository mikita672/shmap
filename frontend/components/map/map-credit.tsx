import { useEffect, useState } from "react";
import { Pressable, type ViewStyle } from "react-native";
import Animated, { FadeOut } from "react-native-reanimated";
import { router } from "expo-router";
import { Text } from "@/components/ui/text";
import { MAP_DATA_CREDIT } from "@/lib/map-credits";

const VISIBLE_MS = 5000;
const FADE_MS = 400;

export interface MapCreditProps {
  dismissed: boolean;
  style?: ViewStyle;
}

export function MapCredit({ dismissed, style }: MapCreditProps) {
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setTimedOut(true), VISIBLE_MS);
    return () => clearTimeout(timer);
  }, []);

  if (dismissed || timedOut) return null;

  return (
    <Animated.View
      exiting={FadeOut.duration(FADE_MS)}
      className="absolute"
      style={style}
    >
      <Pressable
        onPress={() => router.push("/map-data")}
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
    </Animated.View>
  );
}
