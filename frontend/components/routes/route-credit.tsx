import { View, type StyleProp, type ViewStyle } from "react-native";
import { Text } from "@/components/ui/text";

export interface RouteCreditProps {
  style?: StyleProp<ViewStyle>;
}

export function RouteCredit({ style }: RouteCreditProps) {
  return (
    <View
      pointerEvents="none"
      className="absolute right-2 rounded-md bg-black/45 px-1.5 py-0.5"
      style={style}
    >
      <Text className="text-[10px] leading-[14px] text-map-pin-foreground/90">
        © openrouteservice.org · © OpenStreetMap
      </Text>
    </View>
  );
}
