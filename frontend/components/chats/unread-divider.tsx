import { View } from "react-native";
import { Text } from "@/components/ui/text";

export function UnreadDivider() {
  return (
    <View className="py-2">
      <View className="items-center bg-unread-divider py-1">
        <Text className="text-[13px] font-medium leading-5 text-unread-divider-foreground">
          Unread messages
        </Text>
      </View>
    </View>
  );
}
