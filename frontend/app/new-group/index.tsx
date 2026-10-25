import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { TitleHeader } from "@/components/ui/title-header";

export default function NewGroupScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-background">
      <TitleHeader title="New group" />

      <View className="flex-1" />

      <View className="px-6 pt-4" style={{ paddingBottom: insets.bottom + 24 }}>
        <Button size="xl" disabled>
          <Text className="text-2xl">Next</Text>
        </Button>
      </View>
    </View>
  );
}
