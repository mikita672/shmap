import Animated, {
  useAnimatedStyle,
  type SharedValue,
} from "react-native-reanimated";
import { Text } from "@/components/ui/text";

const CREDIT_HEIGHT = 18;
const SHEET_GAP = 6;

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
    <Animated.View
      pointerEvents="none"
      className="absolute right-2 top-0 h-[18px] justify-center rounded-md bg-black/45 px-1.5"
      style={style}
    >
      <Text className="text-[10px] leading-[14px] text-map-pin-foreground/90">
        © openrouteservice.org · © OpenStreetMap
      </Text>
    </Animated.View>
  );
}
