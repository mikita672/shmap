import { View } from "react-native";
import { Text } from "@/components/ui/text";

export interface DayChipProps {
  label: string;
}

export function DayChip({ label }: DayChipProps) {
  return (
    <View className="items-center py-2">
      <View className="rounded-xl bg-action px-3 py-1">
        <Text className="text-xs font-medium leading-4 text-secondary">
          {label}
        </Text>
      </View>
    </View>
  );
}
