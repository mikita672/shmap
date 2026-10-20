import { View } from "react-native";
import { ScreenHeader } from "@/components/ui/screen-header";

export default function BlockedUsersScreen() {
  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Blocked users" />
    </View>
  );
}
