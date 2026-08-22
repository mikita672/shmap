import {
  Text,
  View,
  Pressable,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, router } from "expo-router";
import { MaterialIcons } from "@/lib/icons";

export default function PasswordResetScreen() {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 justify-center items-center bg-background p-6">
          <Pressable
            className="absolute top-16 left-6 active:opacity-50"
            onPress={() => router.back()}
          >
            <MaterialIcons
              name="keyboard-arrow-left"
              size={52}
              className="text-secondary"
            />
          </Pressable>

          <Text className="absolute top-16 right-8 text-brand font-black text-xl tracking-widest">
            SHMAP
          </Text>

          <Text className="text-4xl font-bold text-foreground">
            Reset the password
          </Text>
          <Text className="mb-16 text-lg text-foreground">
            Reset link will be sent to your email
          </Text>
          <Input
            keyboardType="email-address"
            textContentType="emailAddress"
            autoComplete="email"
            placeholder="Email"
            className="rounded-full h-[60px]"
          />
          <View className="flex-row items-center w-full mt-4 gap-4">
            <Button className="flex-1 bg-primary active:bg-primary/80 rounded-full h-[60px]">
              <Text className="text-secondary font-semibold text-lg">
                Register
              </Text>
            </Button>
          </View>
          <View className="flex-row items-center justify-center w-full mt-2 flex-wrap">
            <Text className="text-secondary text-sm">
              Already have an account?
            </Text>
            <Link href="/login" asChild>
              <Button
                variant="ghost"
                className="px-1 h-auto active:bg-transparent"
              >
                <Text className="text-secondary text-sm underline">Log In</Text>
              </Button>
            </Link>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
