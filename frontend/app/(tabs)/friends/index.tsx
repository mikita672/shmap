import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RoundButton } from "@/components/ui/round-button";
import { Text } from "@/components/ui/text";

export default function FriendsFeedScreen() {
  const insets = useSafeAreaInsets();
  const headerTop = Math.max(insets.top + 8, 48);

  return (
    <View className="flex-1 bg-background">
      <View
        className="flex-row items-center justify-between px-6"
        style={{ marginTop: headerTop }}
      >
        <Text
          role="heading"
          className="text-heading text-[32px] leading-10 tracking-[0.5px]"
        >
          Friends
        </Text>
        <RoundButton icon="groups" size="lg" accessibilityLabel="Friends" />
      </View>
    </View>
  );
}
