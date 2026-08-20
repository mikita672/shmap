import React from "react";
import { View, Text } from "react-native";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function IndexScreen() {
  const { signOut } = useAuth();

  return (
    <View className="flex-1 justify-center items-center bg-background p-6">
      <Text className="text-3xl font-bold mb-8 text-surface">
        Welcome to SHMAP!
      </Text>

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
