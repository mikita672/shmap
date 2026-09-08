import { useAuth } from "@/hooks/useAuth";
import React from "react";
import { View, Text } from "react-native";
import { Button } from "@/components/ui/button";

export default function FriendsScreen() {
  const { signOut } = useAuth();

  return (
    <View className="flex-1 justify-center items-center bg-background">
      <Text className="text-3xl font-bold text-foreground">Friends</Text>
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
