import { Text, View } from "react-native";
import React from "react";
import { Input } from "@/components/ui/input";

export default function LoginScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-primary p-6">
      <Text className="text-5xl font-bold mb-16 text-textPrimary p-6">
        Log In
      </Text>
      <Input
        keyboardType="email-address"
        textContentType="emailAddress"
        autoComplete="email"
        placeholder="Username or Email"
        className="mb-4 bg-secondary text-textSecondary placeholder:text-textSecondary/70 rounded-full h-[60px]"
      />
      <Input
        keyboardType="default"
        textContentType="password"
        secureTextEntry
        autoComplete="password"
        placeholder="Password"
        className="bg-secondary text-textSecondary placeholder:text-textSecondary/70 rounded-full h-[60px]"
      />
    </View>
  );
}
