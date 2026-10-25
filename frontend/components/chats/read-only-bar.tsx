import { View } from "react-native";
import { Text } from "@/components/ui/text";

export interface ReadOnlyBarProps {
  firstName: string;
}

export function ReadOnlyBar({ firstName }: ReadOnlyBarProps) {
  return (
    <View className="bg-background px-[26px] pb-3 pt-2">
      <View className="items-center gap-1 rounded-[28px] bg-action px-6 py-4">
        <Text className="text-center text-base font-medium leading-6 text-action-foreground">
          You&apos;re no longer friends
        </Text>
        <Text className="text-center text-sm leading-5 text-secondary">
          You can still read this chat. Add {firstName} as a friend again to
          send messages.
        </Text>
      </View>
    </View>
  );
}
