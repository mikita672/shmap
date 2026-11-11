import { useEffect } from "react";
import * as Notifications from "expo-notifications";
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
    let sentToken: string | null = null;

    async function register(devicePushToken?: Notifications.DevicePushToken) {
      const token = await getExpoPushToken(devicePushToken);
      if (!token || cancelled || token === sentToken) {
        return;
      }

      sentToken = token;
      try {
        await registerPushToken(token);
      } catch (error) {
        sentToken = null;
        throw error;
      }
    }

    function handleFailure(error: unknown) {
      console.warn("Failed to register push token", error);
    }

    const subscription = Notifications.addPushTokenListener(
      (devicePushToken) => {
        register(devicePushToken).catch(handleFailure);
      },
    );
    register().catch(handleFailure);

    return () => {
      cancelled = true;
      subscription.remove();
    };
  }, [isAuthenticated]);
}
