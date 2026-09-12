import { useState } from "react";
import {
  ActivityIndicator,
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

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MaterialIcons } from "@/lib/icons";
import { forgotPassword, verifyOtp, resetPassword } from "@/lib/api/auth";
import { extractApiError } from "@/lib/utils/error";
import { AuthErrorCode } from "@/lib/types/api";
import { cn } from "@/lib/utils";

type Step = "email" | "otp" | "newPassword";

export default function PasswordResetScreen() {
  const [step, setStep] = useState<Step>("email");

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const forgotMutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      setStep("otp");
    },
  });

  const verifyMutation = useMutation({
    mutationFn: verifyOtp,
    onSuccess: () => {
      setStep("newPassword");
    },
  });

  const resetMutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => router.replace("/login"),
  });

  const activeMutation =
    step === "email"
      ? forgotMutation
      : step === "otp"
        ? verifyMutation
        : resetMutation;

  const apiError = activeMutation.error
    ? extractApiError(activeMutation.error)
    : null;

  const isMaxAttempts =
    apiError?.code === AuthErrorCode.OTP_MAX_ATTEMPTS_EXCEEDED;
  const isOtpExpired = apiError?.code === AuthErrorCode.OTP_EXPIRED;
  const isInvalidOtp = apiError?.code === AuthErrorCode.INVALID_OTP;

  const isPending =
    forgotMutation.isPending ||
    verifyMutation.isPending ||
    resetMutation.isPending;

  const passwordsMismatch =
    confirmPassword.length > 0 && newPassword !== confirmPassword;

  const handleRequestNewCode = () => {
    verifyMutation.reset();
    resetMutation.reset();
    forgotMutation.reset();
    setOtp("");
    setStep("email");
  };

  const handleResendCode = () => {
    verifyMutation.reset();
    forgotMutation.mutate(
      { email },
      {
        onSuccess: () => {
          setOtp("");
        },
      },
    );
  };

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
              onPress={() => {
                if (step === "newPassword") {
                  setStep("otp");
                } else if (step === "otp") {
                  setStep("email");
                } else {
                  router.back();
                }
              }}
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
              Reset password
            </Text>

            <Text className="mb-12 text-lg text-foreground text-center mt-2">
              {step === "email" &&
                "Enter your e-mail to receive a one-time code"}
              {step === "otp" && `Enter the 6-digit code sent to ${email}`}
              {step === "newPassword" && "Choose a strong new password"}
            </Text>

            {/* General Banner Error */}
            {apiError && !isInvalidOtp && !isMaxAttempts && !isOtpExpired && (
              <Text className="text-destructive text-sm mb-4 text-center">
                {apiError.message}
              </Text>
            )}

            {/* OTP Max Attempts Alert & Recovery */}
            {isMaxAttempts && (
              <View className="w-full bg-destructive/10 border border-destructive/30 rounded-xl p-4 mb-4 items-center">
                <Text className="text-destructive text-sm font-medium text-center mb-2">
                  {apiError.message}
                </Text>
                <Button
                  variant="outline"
                  className="rounded-full h-[44px] px-6 mt-1"
                  onPress={handleRequestNewCode}
                >
                  <Text className="text-foreground text-sm font-semibold">
                    Request new code
                  </Text>
                </Button>
              </View>
            )}

            {/* OTP Expired Alert & Resend */}
            {isOtpExpired && (
              <View className="w-full bg-destructive/10 border border-destructive/30 rounded-xl p-4 mb-4 items-center">
                <Text className="text-destructive text-sm font-medium text-center mb-2">
                  {apiError.message}
                </Text>
                <Button
                  variant="outline"
                  className="rounded-full h-[44px] px-6 mt-1"
                  onPress={handleResendCode}
                  disabled={forgotMutation.isPending}
                >
                  {forgotMutation.isPending ? (
                    <ActivityIndicator size="small" />
                  ) : (
                    <Text className="text-foreground text-sm font-semibold">
                      Resend code
                    </Text>
                  )}
                </Button>
              </View>
            )}

            {step === "email" && (
              <View className="w-full">
                <Input
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  autoComplete="email"
                  autoCapitalize="none"
                  placeholder="Email"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (forgotMutation.error) forgotMutation.reset();
                  }}
                  editable={!isPending}
                  className={cn(
                    "rounded-full h-[60px]",
                    apiError?.fieldErrors?.email &&
                      "border-destructive border-2",
                  )}
                />
                {apiError?.fieldErrors?.email && (
                  <Text className="text-destructive text-xs mt-1 ml-4">
                    {apiError.fieldErrors.email}
                  </Text>
                )}
                <Button
                  className="w-full mt-4 bg-primary active:bg-primary/80 rounded-full h-[60px]"
                  disabled={!email.trim() || isPending}
                  onPress={() => forgotMutation.mutate({ email: email.trim() })}
                >
                  {forgotMutation.isPending ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="text-secondary font-semibold text-lg">
                      Send code
                    </Text>
                  )}
                </Button>
              </View>
            )}

            {step === "otp" && (
              <View className="w-full">
                <Input
                  keyboardType="numeric"
                  placeholder="6-digit code"
                  maxLength={6}
                  value={otp}
                  onChangeText={(text) => {
                    setOtp(text);
                    if (verifyMutation.error) verifyMutation.reset();
                  }}
                  editable={!isPending && !isMaxAttempts}
                  className={cn(
                    "rounded-full h-[60px] text-center text-xl tracking-widest",
                    (isInvalidOtp || apiError?.fieldErrors?.otp) &&
                      "border-destructive border-2",
                  )}
                />
                {isInvalidOtp && (
                  <Text className="text-destructive text-xs mt-1 text-center">
                    {apiError?.message || "Invalid verification code"}
                  </Text>
                )}
                <Button
                  className="w-full mt-4 bg-primary active:bg-primary/80 rounded-full h-[60px]"
                  disabled={otp.length < 6 || isPending || isMaxAttempts}
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

                {!isMaxAttempts && (
                  <View className="flex-row items-center justify-center w-full mt-4">
                    <Text className="text-secondary text-sm">
                      {"Didn't receive a code? "}
                    </Text>
                    <Button
                      variant="ghost"
                      className="px-1 h-auto active:bg-transparent"
                      disabled={forgotMutation.isPending}
                      onPress={handleResendCode}
                    >
                      <Text className="text-secondary text-sm underline">
                        {forgotMutation.isPending ? "Sending..." : "Resend"}
                      </Text>
                    </Button>
                  </View>
                )}
              </View>
            )}

            {step === "newPassword" && (
              <View className="w-full">
                <Input
                  textContentType="newPassword"
                  secureTextEntry
                  placeholder="New password (min. 8 characters)"
                  value={newPassword}
                  onChangeText={(text) => {
                    setNewPassword(text);
                    if (resetMutation.error) resetMutation.reset();
                  }}
                  editable={!isPending}
                  className={cn(
                    "mb-4 rounded-full h-[60px]",
                    apiError?.fieldErrors?.newPassword &&
                      "border-destructive border-2",
                  )}
                />
                {apiError?.fieldErrors?.newPassword && (
                  <Text className="text-destructive text-xs -mt-3 mb-3 ml-4">
                    {apiError.fieldErrors.newPassword}
                  </Text>
                )}
                <Input
                  textContentType="newPassword"
                  secureTextEntry
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (resetMutation.error) resetMutation.reset();
                  }}
                  editable={!isPending}
                  className={cn(
                    "rounded-full h-[60px]",
                    passwordsMismatch && "border-destructive border-2",
                  )}
                />
                {passwordsMismatch && (
                  <Text className="text-destructive text-xs mt-1 ml-4">
                    Passwords do not match
                  </Text>
                )}
                <Button
                  className="w-full mt-4 bg-primary active:bg-primary/80 rounded-full h-[60px]"
                  disabled={
                    !email ||
                    !newPassword ||
                    newPassword.length < 8 ||
                    !confirmPassword ||
                    passwordsMismatch ||
                    isPending
                  }
                  onPress={() =>
                    resetMutation.mutate({ email, otp, newPassword })
                  }
                >
                  {resetMutation.isPending ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="text-secondary font-semibold text-lg">
                      Reset password
                    </Text>
                  )}
                </Button>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
