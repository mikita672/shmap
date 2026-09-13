import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Text,
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  ScrollView,
} from "react-native";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import {
  GoogleSignin,
  statusCodes,
  isGoogleSigninUnavailable,
} from "@/lib/google-signin";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginUser, verifyGoogleToken } from "@/lib/api/auth";
import { useAuth } from "@/hooks/useAuth";
import { extractApiError } from "@/lib/utils/error";
import { AuthErrorCode } from "@/lib/types/api";
import { cn } from "@/lib/utils";
import { toast } from "sonner-native";

export default function LoginScreen() {
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID?.trim();
  const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID?.trim();
  const isGoogleConfigured = Boolean(webClientId) && !isGoogleSigninUnavailable;

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

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (response) => {
      signIn(response.data);
    },
  });

  const googleLoginMutation = useMutation({
    mutationFn: verifyGoogleToken,
    onSuccess: (response) => {
      signIn(response.data);
    },
  });

  const handleGoogleSignIn = async () => {
    loginMutation.reset();
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

  const activeError = googleLoginMutation.error || loginMutation.error;
  const apiError = activeError ? extractApiError(activeError) : null;
  const isInvalidCredentials =
    apiError?.code === AuthErrorCode.INVALID_CREDENTIALS;
  const emailFieldError = apiError?.fieldErrors?.email;
  const passwordFieldError = apiError?.fieldErrors?.password;

  const lastToastedError = useRef<string | null>(null);
  useEffect(() => {
    if (apiError?.message && apiError.message !== lastToastedError.current) {
      lastToastedError.current = apiError.message;
      toast.error(apiError.message);
    } else if (!apiError) {
      lastToastedError.current = null;
    }
  }, [apiError]);

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (loginMutation.error) loginMutation.reset();
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (loginMutation.error) loginMutation.reset();
  };

  const isGooglePending =
    isNativeGooglePending || googleLoginMutation.isPending;
  const isPending = loginMutation.isPending || isGooglePending;

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
            <Text className="absolute top-16 right-8 text-brand font-black text-xl tracking-widest">
              SHMAP
            </Text>

            <Text className="text-5xl font-bold mb-16 text-foreground p-6">
              Log In
            </Text>

            <View className="w-full mb-4">
              <Input
                keyboardType="email-address"
                textContentType="emailAddress"
                autoComplete="email"
                autoCapitalize="none"
                placeholder="Email"
                value={email}
                onChangeText={handleEmailChange}
                editable={!isPending}
                className={cn(
                  "rounded-full h-[60px]",
                  (isInvalidCredentials || emailFieldError) &&
                    "border-destructive border-2",
                )}
              />
              {emailFieldError && (
                <Text className="text-destructive text-xs mt-1 ml-4">
                  {emailFieldError}
                </Text>
              )}
            </View>

            <View className="w-full mb-4">
              <Input
                keyboardType="default"
                textContentType="password"
                secureTextEntry
                autoComplete="password"
                placeholder="Password"
                value={password}
                onChangeText={handlePasswordChange}
                editable={!isPending}
                className={cn(
                  "rounded-full h-[60px]",
                  (isInvalidCredentials || passwordFieldError) &&
                    "border-destructive border-2",
                )}
              />
              {passwordFieldError && (
                <Text className="text-destructive text-xs mt-1 ml-4">
                  {passwordFieldError}
                </Text>
              )}
            </View>

            <View className="flex-row items-center w-full mt-4 gap-4">
              <Button
                className="flex-1 bg-primary active:bg-primary/80 rounded-full h-[60px]"
                onPress={() => {
                  googleLoginMutation.reset();
                  loginMutation.reset();
                  loginMutation.mutate({ email, password });
                }}
                disabled={isPending || !email || !password}
              >
                {loginMutation.isPending ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-secondary font-semibold text-lg">
                    Log In
                  </Text>
                )}
              </Button>
              <Button
                onPress={handleGoogleSignIn}
                disabled={isPending || !isGoogleConfigured}
                className="bg-secondary active:bg-secondary/80 rounded-full h-[60px] w-[60px] justify-center items-center"
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
              <Text className="text-secondary text-sm">You can also </Text>
              <Link href="/register" asChild>
                <Button
                  variant="ghost"
                  className="px-1 h-auto active:bg-transparent"
                >
                  <Text className="text-secondary text-sm underline">
                    Register
                  </Text>
                </Button>
              </Link>
              <Text className="text-secondary text-sm"> or </Text>
              <Link href="/passwordReset" asChild>
                <Button
                  variant="ghost"
                  className="px-1 h-auto active:bg-transparent"
                >
                  <Text className="text-secondary text-sm underline">
                    Reset password
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
