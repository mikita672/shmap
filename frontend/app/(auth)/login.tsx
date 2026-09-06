import { useEffect, useState } from "react";
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
import { AxiosError } from "axios";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginUser, verifyGoogleToken } from "@/lib/api/auth";
import { useAuth } from "@/hooks/useAuth";

export default function LoginScreen() {
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID?.trim();
  const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID?.trim();
  const isGoogleConfigured = Boolean(webClientId);
  const [googleConfigError, setGoogleConfigError] = useState<string | null>(null);

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
      setGoogleConfigError("Google login is not configured.");
      return;
    }
    setGoogleConfigError(null);

    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (response.data?.idToken) {
        googleLoginMutation.mutate(response.data.idToken);
      } else {
        setGoogleConfigError("Failed to obtain ID token from Google.");
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("User cancelled Google Sign-In");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        setGoogleConfigError("Google Sign-In is already in progress.");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        setGoogleConfigError("Google Play Services is not available on this device.");
      } else {
        console.error("Google Sign-In Error:", error);
        setGoogleConfigError(error?.message ?? "Google Sign-In failed.");
      }
    }
  };

  const activeError = googleLoginMutation.error || loginMutation.error;
  const errorMessage =
    googleConfigError ??
    (activeError instanceof AxiosError
      ? (activeError.response?.data?.error ?? "Login failed")
      : activeError?.message);

  const isPending = loginMutation.isPending || googleLoginMutation.isPending;

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

            {errorMessage && (
              <Text className="text-destructive text-sm mb-4 text-center">
                {errorMessage}
              </Text>
            )}

            <Input
              keyboardType="email-address"
              textContentType="emailAddress"
              autoComplete="email"
              autoCapitalize="none"
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              editable={!isPending}
              className="mb-4 rounded-full h-[60px]"
            />
            <Input
              keyboardType="default"
              textContentType="password"
              secureTextEntry
              autoComplete="password"
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              editable={!isPending}
              className="rounded-full h-[60px]"
            />

            <View className="flex-row items-center w-full mt-4 gap-4">
              <Button
                className="flex-1 bg-primary active:bg-primary/80 rounded-full h-[60px]"
                onPress={() => {
                  googleLoginMutation.reset();
                  loginMutation.reset();
                  setGoogleConfigError(null);
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
                {googleLoginMutation.isPending ? (
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
