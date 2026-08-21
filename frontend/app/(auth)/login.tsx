import { useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginUser } from "@/lib/api/auth";
import { useAuth } from "@/hooks/useAuth";

export default function LoginScreen() {
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (response) => {
      signIn(response.data);
    },
  });

  const errorMessage =
    loginMutation.error instanceof AxiosError
      ? (loginMutation.error.response?.data?.error ?? "Login failed")
      : loginMutation.error?.message;

  return (
    <View className="flex-1 justify-center items-center bg-background p-6">
      <Text className="absolute top-16 right-8 text-brand font-black text-xl tracking-widest">
        SHMAP
      </Text>

      <Text className="text-5xl font-bold mb-16 text-foreground p-6">Log In</Text>

      {errorMessage && (
        <Text className="text-destructive text-sm mb-4">{errorMessage}</Text>
      )}

      <Input
        keyboardType="email-address"
        textContentType="emailAddress"
        autoComplete="email"
        autoCapitalize="none"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        editable={!loginMutation.isPending}
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
        editable={!loginMutation.isPending}
        className="rounded-full h-[60px]"
      />

      <View className="flex-row items-center w-full mt-4 gap-4">
        <Button
          className="flex-1 bg-primary active:bg-primary/80 rounded-full h-[60px]"
          onPress={() => loginMutation.mutate({ email, password })}
          disabled={loginMutation.isPending || !email || !password}
        >
          {loginMutation.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-secondary font-semibold text-lg">Log In</Text>
          )}
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
        <Text className="text-secondary text-sm">You can also </Text>
        <Link href="/register" asChild>
          <Button variant="ghost" className="px-1 h-auto active:bg-transparent">
            <Text className="text-secondary text-sm underline">Register</Text>
          </Button>
        </Link>
        <Text className="text-secondary text-sm"> or </Text>
        <Link href="/passwordReset" asChild>
          <Button variant="ghost" className="px-1 h-auto active:bg-transparent">
            <Text className="text-secondary text-sm underline">
              Reset password
            </Text>
          </Button>
        </Link>
      </View>
    </View>
  );
}
