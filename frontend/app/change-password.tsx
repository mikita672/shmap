import React, { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  type TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner-native";
import { BackButton } from "@/components/ui/back-button";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/hooks/useAuth";
import { changePassword } from "@/lib/api/users";
import { validatePasswordChange } from "@/lib/validation/password";

export default function ChangePasswordScreen() {
  const insets = useSafeAreaInsets();
  const { signIn } = useAuth();
  const backButtonTop = Math.max(insets.top + 8, 48);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const newPasswordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const isFormFilled = Boolean(
    currentPassword && newPassword && confirmPassword,
  );

  const validationErrors = validatePasswordChange({
    currentPassword,
    newPassword,
    confirmPassword,
  });
  const isValid = Object.keys(validationErrors).length === 0;
  const errors = submitAttempted ? validationErrors : {};

  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: async (response) => {
      await signIn(response.data);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      toast.success("Password updated");
      router.back();
    },
    // TODO(step 3.5): show server errors (e.g. wrong current password)
  });

  const handleSubmit = () => {
    setSubmitAttempted(true);
    if (!isValid) return;
    changePasswordMutation.mutate({ currentPassword, newPassword });
  };

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
            error={errors.currentPassword}
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
            error={errors.newPassword}
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
            error={errors.confirmPassword}
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
          />
        </View>

        <Button
          size="xl"
          className="mt-5"
          disabled={!isFormFilled}
          onPress={handleSubmit}
        >
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
