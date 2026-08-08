import { Text, View, Pressable } from "react-native";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

export default function PasswordResetScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-primary p-6">
      <Pressable
        className="absolute top-16 left-6 active:opacity-50"
        onPress={() => router.back()}
      >
        <MaterialIcons name="keyboard-arrow-left" size={52} color="#5F6F52" />
      </Pressable>

      <Text className="absolute top-16 right-8 text-logo font-black text-xl tracking-widest">
        SHMAP
      </Text>

      <Text className="text-4xl font-bold text-textPrimary">
        Reset the password
      </Text>
      <Text className="mb-16 text-lg text-textPrimary">
        Reset link will be sent to your email
      </Text>
      <Input
        keyboardType="email-address"
        textContentType="emailAddress"
        autoComplete="email"
        placeholder="Email"
        className="bg-secondary text-textSecondary placeholder:text-textSecondary/70 rounded-full h-[60px]"
      />
      <View className="flex-row items-center w-full mt-4 gap-4">
        <Button className="flex-1 bg-[#B99470] active:bg-[#B99470]/80 rounded-full h-[60px]">
          <Text className="text-[#5F6F52] font-bold text-lg">Register</Text>
        </Button>
      </View>
      <View className="flex-row items-center justify-center w-full mt-2 flex-wrap">
        <Text className="text-[#5F6F52] text-sm">Already have an account?</Text>
        <Link href="/login" asChild>
          <Button variant="ghost" className="px-1 h-auto active:bg-transparent">
            <Text className="text-[#5F6F52] font-bold text-sm underline">
              Log In
            </Text>
          </Button>
        </Link>
      </View>
    </View>
  );
}
