import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackButton } from "@/components/ui/back-button";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-background">
      <BackButton
        className="absolute left-6"
        style={{ top: Math.max(insets.top + 8, 48) }}
      />
    </View>
  );
}
