import React, { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  type TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackButton } from "@/components/ui/back-button";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { Text } from "@/components/ui/text";

export default function ChangePasswordScreen() {
  const insets = useSafeAreaInsets();
  const backButtonTop = Math.max(insets.top + 8, 48);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const newPasswordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const isFormFilled = Boolean(
    currentPassword && newPassword && confirmPassword,
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-background"
    >
      <ScrollView
        contentContainerClassName="flex-grow justify-center px-6"
        contentContainerStyle={{
          paddingTop: backButtonTop + 56,
          paddingBottom: insets.bottom + 24,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="items-center mb-16">
          <Text className="text-heading text-4xl leading-[44px] tracking-[0.5px] text-center">
            Change password
          </Text>
          <Text className="text-heading tracking-[0.5px] text-center mt-2">
            New password must be at least 8 characters
          </Text>
        </View>

        <View className="gap-3">
          <PasswordInput
            placeholder="Current password"
            autoComplete="current-password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            returnKeyType="next"
            submitBehavior="submit"
            onSubmitEditing={() => newPasswordRef.current?.focus()}
          />
          <PasswordInput
            ref={newPasswordRef}
            placeholder="New password"
            autoComplete="new-password"
            value={newPassword}
            onChangeText={setNewPassword}
            returnKeyType="next"
            submitBehavior="submit"
            onSubmitEditing={() => confirmPasswordRef.current?.focus()}
          />
          <PasswordInput
            ref={confirmPasswordRef}
            placeholder="Confirm new password"
            autoComplete="new-password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            returnKeyType="done"
          />
        </View>

        <Button size="xl" className="mt-5" disabled={!isFormFilled}>
          <Text className="text-2xl">Update password</Text>
        </Button>

        <View className="flex-row items-center justify-center mt-5">
          <Text className="text-secondary tracking-[0.5px]">
            Forgot your password?{" "}
          </Text>
          <Button
            variant="ghost"
            className="h-auto px-0 py-0 active:bg-transparent"
          >
            <Text className="text-secondary text-base font-normal tracking-[0.5px] underline">
              Reset it
            </Text>
          </Button>
        </View>
      </ScrollView>

      <BackButton className="absolute left-6" style={{ top: backButtonTop }} />
    </KeyboardAvoidingView>
  );
}
