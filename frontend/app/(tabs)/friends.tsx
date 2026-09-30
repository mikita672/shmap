import React from "react";
import { View, Text } from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ThemeSwitch } from "@/components/theme-switch";

export default function FriendsScreen() {
  const { signOut } = useAuth();

  return (
    <View className="flex-1 justify-center items-center bg-background px-6 gap-8">
      <Text className="text-3xl font-bold text-foreground">Friends</Text>

      <View className="w-full max-w-xs gap-3">
        <Text className="text-sm font-semibold text-foreground text-center">
          Theme Preference
        </Text>
        <ThemeSwitch />
      </View>

      <Button
        variant="destructive"
        className="rounded-full h-[60px] px-12"
        onPress={() => signOut()}
      >
        <Text className="text-white font-semibold text-lg">Log Out</Text>
      </Button>
    </View>
  );
}
