import React from "react";
import { View, Text, Pressable } from "react-native";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@/lib/icons";
import { toast } from "sonner-native";

export interface ProfileInfoProps {
  username: string;
  email: string;
  className?: string;
}

export function ProfileInfo({ username, email, className }: ProfileInfoProps) {
  const handleCopy = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await Clipboard.setStringAsync(username);
    toast.success("Username copied to clipboard!");
  };

  return (
    <View className={`items-center ${className ?? ""}`}>
      <View className="flex-row items-center gap-1.5">
        <Text className="text-tab-icon-active font-bold text-xl">
          @{username}
        </Text>
        <Pressable
          onPress={handleCopy}
          className="p-1 active:opacity-60"
          accessibilityLabel="Copy username"
          accessibilityRole="button"
        >
          <Ionicons
            name="copy-outline"
            size={18}
            className="text-tab-icon-active"
          />
        </Pressable>
      </View>

      <Text className="text-tab-icon-active text-sm mt-0.5">{email}</Text>
    </View>
  );
}
