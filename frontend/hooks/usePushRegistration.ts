import { useEffect } from "react";
import axios from "axios";
import * as Notifications from "expo-notifications";
import { useAuth } from "@/hooks/useAuth";
import { registerPushToken } from "@/lib/api/push-tokens";
import { getExpoPushToken } from "@/lib/notifications";

const MAX_RETRIES = 3;
const RETRY_BASE_DELAY_MS = 5000;

function isRecoverable(error: unknown) {
  if (!axios.isAxiosError(error) || !error.response) {
    return true;
  }
  const { status } = error.response;
  return status >= 500 || status === 408 || status === 429;
}

export function usePushRegistration() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    let cancelled = false;
    let sentToken: string | null = null;
    let retries = 0;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;

    async function register(devicePushToken?: Notifications.DevicePushToken) {
      const token = await getExpoPushToken(devicePushToken);
      if (!token || cancelled || token === sentToken) {
        return;
      }

      sentToken = token;
      try {
        await registerPushToken(token);
        retries = 0;
      } catch (error) {
        sentToken = null;
        throw error;
      }
    }

    function attempt(devicePushToken?: Notifications.DevicePushToken) {
      if (retryTimer) {
        clearTimeout(retryTimer);
        retryTimer = null;
      }
      register(devicePushToken).catch((error) =>
        handleFailure(error, devicePushToken),
      );
    }

    function handleFailure(
      error: unknown,
      devicePushToken?: Notifications.DevicePushToken,
    ) {
      console.warn("Failed to register push token", error);
      if (cancelled || retries >= MAX_RETRIES || !isRecoverable(error)) {
        return;
      }
      const delay = RETRY_BASE_DELAY_MS * 2 ** retries;
      retries += 1;
      retryTimer = setTimeout(() => attempt(devicePushToken), delay);
    }

    const subscription = Notifications.addPushTokenListener(
      (devicePushToken) => {
        retries = 0;
        attempt(devicePushToken);
      },
    );
    attempt();

    return () => {
      cancelled = true;
      if (retryTimer) {
        clearTimeout(retryTimer);
      }
      subscription.remove();
    };
  }, [isAuthenticated]);
}
