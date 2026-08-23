import { useState } from "react";
import { ActivityIndicator,
  Text,
  View,
  Pressable,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MaterialIcons } from "@/lib/icons";
import { forgotPassword, verifyOtp, resetPassword } from "@/lib/api/auth";

type Step = "email" | "otp" | "newPassword";

export default function PasswordResetScreen() {
  const [step, setStep] = useState<Step>("email");

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const forgotMutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => setStep("otp"),
  });

  const verifyMutation = useMutation({
    mutationFn: verifyOtp,
    onSuccess: () => setStep("newPassword"),
  });

  const resetMutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => router.replace("/login"),
  });

  function getError(
    mutation:
      typeof forgotMutation | typeof verifyMutation | typeof resetMutation,
  ): string | undefined {
    if (!mutation.error) return undefined;

    if (mutation.error instanceof AxiosError) {
      return (
        mutation.error.response?.data?.error ??
        mutation.error.response?.data?.message ??
        "Something went wrong"
      );
    }
    return mutation.error.message;
  }

  const isPending =
    forgotMutation.isPending ||
    verifyMutation.isPending ||
    resetMutation.isPending;

  const errorMessage =
    getError(forgotMutation) ??
    getError(verifyMutation) ??
    getError(resetMutation);

  const passwordsMismatch =
    confirmPassword.length > 0 && newPassword !== confirmPassword;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView
        contentContainerClassName="flex-grow"
        keyboardShouldPersistTaps="handled"
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

      <Text className="text-4xl font-bold text-foreground">Reset password</Text>

      <Text className="mb-16 text-lg text-foreground text-center">
        {step === "email" && "Enter your e-mail to receive a one-time code"}
        {step === "otp" && `Enter the 6-digit code sent to ${email}`}
        {step === "newPassword" && "Choose a strong new password"}
      </Text>

      {errorMessage && (
        <Text className="text-destructive text-sm mb-4">{errorMessage}</Text>
      )}

      {step === "email" && (
        <>
          <Input
            keyboardType="email-address"
            textContentType="emailAddress"
            autoComplete="email"
            autoCapitalize="none"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            editable={!isPending}
            className="rounded-full h-[60px]"
          />
          <Button
            className="w-full mt-4 bg-primary active:bg-primary/80 rounded-full h-[60px]"
            disabled={!email || isPending}
            onPress={() => forgotMutation.mutate({ email })}
          >
            {forgotMutation.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-secondary font-semibold text-lg">
                Send code
              </Text>
            )}
          </Button>
        </>
      )}

      {step === "otp" && (
        <>
          <Input
            keyboardType="numeric"
            placeholder="6-digit code"
            value={otp}
            onChangeText={setOtp}
            editable={!isPending}
            className="rounded-full h-[60px]"
          />
          <Button
            className="w-full mt-4 bg-primary active:bg-primary/80 rounded-full h-[60px]"
            disabled={otp.length < 6 || isPending}
            onPress={() => verifyMutation.mutate({ email, otp })}
          >
            {verifyMutation.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-secondary font-semibold text-lg">
                Verify
              </Text>
            )}
          </Button>
        </>
      )}

      {step === "newPassword" && (
        <>
          <Input
            textContentType="newPassword"
            secureTextEntry
            placeholder="New password"
            value={newPassword}
            onChangeText={setNewPassword}
            editable={!isPending}
            className="mb-4 rounded-full h-[60px]"
          />
          <Input
            textContentType="newPassword"
            secureTextEntry
            placeholder="Confirm new password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            editable={!isPending}
            className="rounded-full h-[60px]"
          />
          {passwordsMismatch && (
            <Text className="text-destructive text-sm mt-2">
              Passwords do not match
            </Text>
          )}
          <Button
            className="w-full mt-4 bg-primary active:bg-primary/80 rounded-full h-[60px]"
            disabled={
              !email ||
              !newPassword ||
              !confirmPassword ||
              passwordsMismatch ||
              isPending
            }
            onPress={() => resetMutation.mutate({ email, otp, newPassword })}
          >
            {resetMutation.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-secondary font-semibold text-lg">
                Reset password
              </Text>
            )}
          </Button>
        </>
      )}
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
