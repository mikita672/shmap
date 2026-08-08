import { Text, View } from "react-native";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
      <View className="flex-row items-center w-full max-w-[360px] mt-4 gap-4">
        <Button className="flex-1 bg-secondary-foreground rounded-full h-[60px]">
          <Text className="text-textSecondary font-bold text-lg">Log In</Text>
        </Button>
        <Button className="bg-textSecondary rounded-full h-[60px] w-[60px]">
          <Text>G</Text>
        </Button>
      </View>
    </View>
  );
}
