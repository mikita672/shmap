import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getExpoPushToken } from "@/lib/notifications";

export function usePushRegistration() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    getExpoPushToken().catch((error) =>
      console.warn("Failed to get push token", error),
    );
  }, [isAuthenticated]);
}
