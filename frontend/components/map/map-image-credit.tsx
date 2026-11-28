import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { MAP_DATA_CREDIT } from "@/lib/map-credits";

export function MapImageCredit() {
  return (
    <View
      pointerEvents="none"
      className="absolute bottom-1 right-1 rounded bg-black/45 px-1"
    >
      <Text className="text-[10px] leading-[14px] text-map-pin-foreground/90">
        {MAP_DATA_CREDIT}
      </Text>
    </View>
  );
}
