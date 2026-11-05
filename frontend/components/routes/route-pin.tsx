import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

export interface RoutePinProps {
  number: number;
  selected?: boolean;
}

export function RoutePin({ number, selected = false }: RoutePinProps) {
  return (
    <View
      className={cn(
        "items-center justify-center rounded-full border-map-pin-foreground bg-map-pin shadow-sm shadow-black/35 elevation-2",
        selected ? "h-10 w-10 border-[3px]" : "h-7 w-7 border-2",
      )}
    >
      <Text
        className={cn(
          "text-center font-medium text-map-pin-foreground",
          selected ? "text-base leading-5" : "text-[13px] leading-4",
        )}
      >
        {number}
      </Text>
    </View>
  );
}
