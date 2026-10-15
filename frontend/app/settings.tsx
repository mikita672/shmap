import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackButton } from "@/components/ui/back-button";
import { Text } from "@/components/ui/text";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const headerTop = Math.max(insets.top + 8, 48);

  return (
    <View className="flex-1 bg-background">
      <View
        className="h-[52px] flex-row items-center px-6"
        style={{ marginTop: headerTop }}
      >
        <BackButton className="relative" />
        <Text
          role="heading"
          className="text-heading text-2xl leading-8 tracking-[0.5px]"
        >
          Settings
        </Text>
      </View>
    </View>
  );
}
