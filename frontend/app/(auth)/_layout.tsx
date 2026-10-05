import { useEffect } from "react";
import { router, Stack } from "expo-router";
import { useAuth } from "@/hooks/useAuth";

export default function AuthLayout() {
  const { pendingRedirect, clearPendingRedirect } = useAuth();

  useEffect(() => {
    if (!pendingRedirect) return;
    router.push(pendingRedirect);
    clearPendingRedirect();
  }, [pendingRedirect, clearPendingRedirect]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="passwordReset" />
    </Stack>
  );
}
