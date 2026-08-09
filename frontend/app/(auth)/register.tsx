import { useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { registerUser } from "@/lib/api/auth";
import { useAuth } from "@/hooks/useAuth";

export default function RegisterScreen() {
  const { signUp } = useAuth();

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (response) => {
      signUp(response.data);
    },
  });

  const passwordsMatch = password === confirmPassword;
  const canSubmit =
    firstname && lastname && username && email && password && passwordsMatch;

  const errorMessage = !passwordsMatch
    ? "Passwords do not match"
    : registerMutation.error instanceof AxiosError
      ? (registerMutation.error.response?.data?.error ?? "Registration failed")
      : registerMutation.error?.message;

  const isDisabled = registerMutation.isPending;

  return (
    <View className="flex-1 justify-center items-center bg-background p-6">
      <Text className="absolute top-16 right-8 text-logo font-black text-xl tracking-widest">
        SHMAP
      </Text>

      <Text className="text-5xl font-bold mb-16 text-textPrimary p-6">
        Register
      </Text>

      {errorMessage && (
        <Text className="text-destructive text-sm mb-4">{errorMessage}</Text>
      )}

      <View className="flex-row w-full gap-4 mb-4">
        <Input
          textContentType="givenName"
          autoComplete="given-name"
          placeholder="First name"
          value={firstname}
          onChangeText={setFirstname}
          editable={!isDisabled}
          className="flex-1 bg-textPrimary text-primary placeholder:text-primary rounded-full h-[60px]"
        />
        <Input
          textContentType="familyName"
          autoComplete="family-name"
          placeholder="Last name"
          value={lastname}
          onChangeText={setLastname}
          editable={!isDisabled}
          className="flex-1 bg-textPrimary text-primary placeholder:text-primary rounded-full h-[60px]"
        />
      </View>

      <Input
        textContentType="username"
        autoComplete="username"
        autoCapitalize="none"
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        editable={!isDisabled}
        className="mb-4 bg-textPrimary text-primary placeholder:text-primary rounded-full h-[60px]"
      />
      <Input
        keyboardType="email-address"
        textContentType="emailAddress"
        autoComplete="email"
        autoCapitalize="none"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        editable={!isDisabled}
        className="mb-4 bg-textPrimary text-primary placeholder:text-primary rounded-full h-[60px]"
      />
      <Input
        keyboardType="default"
        textContentType="newPassword"
        secureTextEntry
        autoComplete="new-password"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        editable={!isDisabled}
        className="mb-4 bg-textPrimary text-primary placeholder:text-primary rounded-full h-[60px]"
      />
      <Input
        keyboardType="default"
        textContentType="newPassword"
        secureTextEntry
        autoComplete="new-password"
        placeholder="Confirm password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        editable={!isDisabled}
        className="bg-textPrimary text-primary placeholder:text-primary rounded-full h-[60px]"
      />

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
            <Text className="text-secondary text-sm underline">Log In</Text>
          </Button>
        </Link>
      </View>
    </View>
  );
}
