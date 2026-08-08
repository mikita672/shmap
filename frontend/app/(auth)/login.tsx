import { Text, View } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "expo-router";

export default function LoginScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-primary p-6">
      <Text className="absolute top-16 right-8 text-logo font-black text-xl tracking-widest">
        SHMAP
      </Text>

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
      <View className="flex-row items-center w-full mt-4 gap-4">
        <Button className="flex-1 bg-[#B99470] active:bg-[#B99470]/80 rounded-full h-[60px]">
          <Text className="text-[#5F6F52] font-bold text-lg">Log In</Text>
        </Button>
        <Button className="bg-[#5F6F52] active:bg-[#5F6F52]/80 rounded-full h-[60px] w-[60px] justify-center items-center">
          <Image
            source={require("@/assets/images/google-logo.png")}
            style={{ width: 32, height: 32 }}
            contentFit="contain"
          />
        </Button>
      </View>
      <View className="flex-row items-center justify-center w-full mt-2 flex-wrap">
        <Text className="text-[#5F6F52] text-sm">You can also </Text>
        <Link href="/register" asChild>
          <Button variant="ghost" className="px-1 h-auto active:bg-transparent">
            <Text className="text-[#5F6F52] font-bold text-sm underline">
              Register
            </Text>
          </Button>
        </Link>
        <Text className="text-[#5F6F52] text-sm"> or </Text>
        <Button variant="ghost" className="px-1 h-auto active:bg-transparent">
          <Text className="text-[#5F6F52] font-bold text-sm underline">
            Reset password
          </Text>
        </Button>
      </View>
    </View>
  );
}
