import { Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  type SharedValue,
} from "react-native-reanimated";
import { router } from "expo-router";
import { Text } from "@/components/ui/text";

const CREDIT_HEIGHT = 18;
const SHEET_GAP = 6;
const ROUTE_CREDIT =
  "© openrouteservice.org · © OpenStreetMap · © OpenMapTiles";

export interface RouteCreditProps {
  sheetPosition: SharedValue<number>;
}

export function RouteCredit({ sheetPosition }: RouteCreditProps) {
  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: sheetPosition.value - CREDIT_HEIGHT - SHEET_GAP },
    ],
  }));

  return (
    <Animated.View className="absolute right-2 top-0" style={style}>
      <Pressable
        onPress={() => router.push("/map-data")}
        hitSlop={8}
        accessibilityRole="link"
        accessibilityLabel={`Map data ${ROUTE_CREDIT}`}
        accessibilityHint="Opens map data and licenses"
        className="h-[18px] justify-center rounded-md bg-black/45 px-1.5 active:bg-black/60"
      >
        <Text className="text-[10px] leading-[14px] text-map-pin-foreground/90">
          {ROUTE_CREDIT}
        </Text>
      </Pressable>
    </Animated.View>
  );
}
