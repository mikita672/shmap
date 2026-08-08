import { Text, View } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "expo-router";

export default function RegisterScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-background p-6">
      <Text className="absolute top-16 right-8 text-logo font-black text-xl tracking-widest">
        SHMAP
      </Text>

      <Text className="text-5xl font-bold mb-16 text-textPrimary p-6">
        Register
      </Text>
      <Input
        keyboardType="email-address"
        textContentType="emailAddress"
        autoComplete="email"
        placeholder="Email"
        className="mb-4 bg-textPrimary text-primary placeholder:text-primary rounded-full h-[60px]"
      />
      <Input
        keyboardType="default"
        textContentType="password"
        secureTextEntry
        autoComplete="password"
        placeholder="Password"
        className="mb-4 bg-textPrimary text-primary placeholder:text-primary rounded-full h-[60px]"
      />
      <Input
        keyboardType="default"
        textContentType="password"
        secureTextEntry
        autoComplete="password"
        placeholder="Password"
        className="bg-textPrimary text-primary placeholder:text-primary rounded-full h-[60px]"
      />

      <View className="flex-row items-center w-full mt-4 gap-4">
        <Button className="flex-1 bg-primary active:bg-primary/80 rounded-full h-[60px]">
          <Text className="text-secondary font-semibold text-lg">Register</Text>
        </Button>
        <Button className="bg-secondary active:bg-secondary/80 rounded-full h-[60px] w-[60px] justify-center items-center">
          <Image
            source={require("@/assets/images/google-logo.png")}
            style={{ width: 32, height: 32 }}
            contentFit="contain"
          />
        </Button>
      </View>
      <View className="flex-row items-center justify-center w-full mt-2 flex-wrap">
        <Text className="text-secondary text-sm">Already have an account?</Text>
        <Link href="/login" asChild>
          <Button variant="ghost" className="px-1 h-auto active:bg-transparent">
            <Text className="text-secondary font-bold text-sm underline">
              Log In
            </Text>
          </Button>
        </Link>
      </View>
    </View>
  );
}
