import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Text,
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
} from "react-native";
import { Image } from "expo-image";
import { Link, router } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import {
  GoogleSignin,
  statusCodes,
  isGoogleSigninUnavailable,
} from "@/lib/google-signin";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { registerUser, verifyGoogleToken } from "@/lib/api/auth";
import { useAuth } from "@/hooks/useAuth";
import { MaterialIcons } from "@/lib/icons";
import { extractApiError } from "@/lib/utils/error";
import { cn } from "@/lib/utils";
import { toast } from "sonner-native";

export default function RegisterScreen() {
  const { signUp } = useAuth();

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID?.trim();
  const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID?.trim();

  const [isNativeGooglePending, setIsNativeGooglePending] = useState(false);

  useEffect(() => {
    if (isGoogleSigninUnavailable) {
      toast.error(
        "Google Sign-In is not available in Expo Go. Use a development build.",
      );
    }
  }, []);

  useEffect(() => {
    if (webClientId) {
      GoogleSignin.configure({
        webClientId,
        iosClientId,
      });
    }
  }, [webClientId, iosClientId]);

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (response) => {
      signUp(response.data);
    },
  });

  const googleLoginMutation = useMutation({
    mutationFn: verifyGoogleToken,
    onSuccess: (response) => {
      signUp(response.data);
    },
  });

  const handleGoogleSignIn = async () => {
    registerMutation.reset();
    googleLoginMutation.reset();
    if (!webClientId) {
      toast.error("Google login is not configured.");
      return;
    }
    setIsNativeGooglePending(true);

    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (response.type === "cancelled") {
        return;
      }
      if (response.data.idToken) {
        googleLoginMutation.mutate(response.data.idToken);
      } else {
        toast.error("Failed to obtain ID token from Google.");
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("User cancelled Google Sign-In");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        toast.error("Google Sign-In is already in progress.");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        toast.error("Google Play Services is not available on this device.");
      } else {
        console.error("Google Sign-In Error:", error);
        toast.error(error?.message ?? "Google Sign-In failed.");
      }
    } finally {
      setIsNativeGooglePending(false);
    }
  };

  const clearErrors = () => {
    if (registerMutation.error) registerMutation.reset();
    if (googleLoginMutation.error) googleLoginMutation.reset();
  };

  const passwordsMatch = password === confirmPassword;
  const confirmPasswordMismatch = confirmPassword.length > 0 && !passwordsMatch;
  const canSubmit =
    firstname && lastname && username && email && password && passwordsMatch;

  const activeError = googleLoginMutation.error || registerMutation.error;
  const apiError = activeError ? extractApiError(activeError) : null;
  const fieldErrors = apiError?.fieldErrors || {};

  const lastToastedError = useRef<string | null>(null);
  useEffect(() => {
    const hasFieldErrors = Object.keys(fieldErrors).length > 0;
    if (
      apiError?.message &&
      !hasFieldErrors &&
      apiError.message !== lastToastedError.current
    ) {
      lastToastedError.current = apiError.message;
      toast.error(apiError.message);
    } else if (!apiError) {
      lastToastedError.current = null;
    }
  }, [apiError, fieldErrors]);

  const isGooglePending =
    isNativeGooglePending || googleLoginMutation.isPending;
  const isDisabled = registerMutation.isPending || isGooglePending;

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

            <Text className="text-5xl font-bold mb-16 text-foreground p-6">
              Register
            </Text>

            <View className="flex-row w-full gap-4 mb-4">
              <View className="flex-1">
                <Input
                  textContentType="givenName"
                  autoComplete="given-name"
                  placeholder="First name"
                  value={firstname}
                  onChangeText={(t) => {
                    setFirstname(t);
                    clearErrors();
                  }}
                  editable={!isDisabled}
                  className={cn(
                    "rounded-full h-[60px]",
                    fieldErrors.firstname && "border-destructive border-2",
                  )}
                />
                {fieldErrors.firstname && (
                  <Text className="text-destructive text-xs mt-1 ml-4">
                    {fieldErrors.firstname}
                  </Text>
                )}
              </View>

              <View className="flex-1">
                <Input
                  textContentType="familyName"
                  autoComplete="family-name"
                  placeholder="Last name"
                  value={lastname}
                  onChangeText={(t) => {
                    setLastname(t);
                    clearErrors();
                  }}
                  editable={!isDisabled}
                  className={cn(
                    "rounded-full h-[60px]",
                    fieldErrors.lastname && "border-destructive border-2",
                  )}
                />
                {fieldErrors.lastname && (
                  <Text className="text-destructive text-xs mt-1 ml-4">
                    {fieldErrors.lastname}
                  </Text>
                )}
              </View>
            </View>

            <View className="w-full mb-4">
              <Input
                textContentType="username"
                autoComplete="username"
                autoCapitalize="none"
                placeholder="Username"
                value={username}
                onChangeText={(t) => {
                  setUsername(t);
                  clearErrors();
                }}
                editable={!isDisabled}
                className={cn(
                  "rounded-full h-[60px]",
                  fieldErrors.username && "border-destructive border-2",
                )}
              />
              {fieldErrors.username && (
                <Text className="text-destructive text-xs mt-1 ml-4">
                  {fieldErrors.username}
                </Text>
              )}
            </View>

            <View className="w-full mb-4">
              <Input
                keyboardType="email-address"
                textContentType="emailAddress"
                autoComplete="email"
                autoCapitalize="none"
                placeholder="Email"
                value={email}
                onChangeText={(t) => {
                  setEmail(t);
                  clearErrors();
                }}
                editable={!isDisabled}
                className={cn(
                  "rounded-full h-[60px]",
                  fieldErrors.email && "border-destructive border-2",
                )}
              />
              {fieldErrors.email && (
                <Text className="text-destructive text-xs mt-1 ml-4">
                  {fieldErrors.email}
                </Text>
              )}
            </View>

            <View className="w-full mb-4">
              <Input
                keyboardType="default"
                textContentType="newPassword"
                secureTextEntry
                autoComplete="new-password"
                placeholder="Password"
                value={password}
                onChangeText={(t) => {
                  setPassword(t);
                  clearErrors();
                }}
                editable={!isDisabled}
                className={cn(
                  "rounded-full h-[60px]",
                  fieldErrors.password && "border-destructive border-2",
                )}
              />
              {fieldErrors.password && (
                <Text className="text-destructive text-xs mt-1 ml-4">
                  {fieldErrors.password}
                </Text>
              )}
            </View>

            <View className="w-full mb-4">
              <Input
                keyboardType="default"
                textContentType="newPassword"
                secureTextEntry
                autoComplete="new-password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChangeText={(t) => {
                  setConfirmPassword(t);
                  clearErrors();
                }}
                editable={!isDisabled}
                className={cn(
                  "rounded-full h-[60px]",
                  confirmPasswordMismatch && "border-destructive border-2",
                )}
              />
              {confirmPasswordMismatch && (
                <Text className="text-destructive text-xs mt-1 ml-4">
                  Passwords do not match
                </Text>
              )}
            </View>

            <View className="flex-row items-center w-full mt-4 gap-4">
              <Button
                className="flex-1 bg-primary active:bg-primary/80 rounded-full h-[60px]"
                onPress={() =>
                  registerMutation.mutate({
                    firstname,
                    lastname,
                    username,
                    email,
                    password,
                  })
                }
                disabled={isDisabled || !canSubmit}
              >
                {registerMutation.isPending ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-secondary font-semibold text-lg">
                    Register
                  </Text>
                )}
              </Button>
              <Button
                className="bg-secondary active:bg-secondary/80 rounded-full h-[60px] w-[60px] justify-center items-center"
                onPress={handleGoogleSignIn}
                disabled={isDisabled}
              >
                {isGooglePending ? (
                  <ActivityIndicator color="#000" />
                ) : (
                  <Image
                    source={require("@/assets/images/google-logo.png")}
                    style={{ width: 32, height: 32 }}
                    contentFit="contain"
                  />
                )}
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
                  <Text className="text-secondary text-sm underline">
                    Log In
                  </Text>
                </Button>
              </Link>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
