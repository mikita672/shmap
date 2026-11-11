import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { registerPushToken } from "@/lib/api/push-tokens";
import { getExpoPushToken } from "@/lib/notifications";

export function usePushRegistration() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    let cancelled = false;

    async function register() {
      const token = await getExpoPushToken();
      if (!token || cancelled) {
        return;
      }
      await registerPushToken(token);
    }

    register().catch((error) =>
      console.warn("Failed to register push token", error),
    );

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);
}
