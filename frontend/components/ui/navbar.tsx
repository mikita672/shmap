import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, Text, Pressable } from "react-native";

interface NavbarProps {
  title?: string;
  onLogout?: () => void;
}

export function Navbar({ title = "SHMAP", onLogout }: NavbarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{ paddingTop: insets.top }}
      className="bg-primary px-4 pb-4 shadow-md shadow-black/30"
    >
      <View className="flex-row items-center justify-between h-14">
        <Text className="text-xl font-bold text-primary-foreground">
          {title}
        </Text>
        {onLogout && (
          <Pressable
            onPress={onLogout}
            className="px-3 py-1.5 rounded active:opacity-70"
          >
            <Text className="text-primary-foreground font-medium text-sm">
              Log Out
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
