import { useEffect } from "react";
import { AppState, type AppStateStatus } from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { getAccessToken } from "@/lib/api/client";
import { readEventStream } from "@/lib/api/events";

export function useChatEvents() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    let controller: AbortController | null = null;

    async function connect() {
      controller?.abort();
      const currentController = new AbortController();
      controller = currentController;

      try {
        const token = await getAccessToken();
        if (!token || currentController.signal.aborted) {
          return;
        }

        await readEventStream({
          token,
          signal: currentController.signal,
          onEvent: (event) => {
            if (__DEV__) {
              console.log(
                "[chat-events]",
                event.event ?? "message",
                event.data,
              );
            }
          },
          onComment: (comment) => {
            if (__DEV__) {
              console.log("[chat-events] comment", comment);
            }
          },
        });
      } catch (error) {
        if (currentController.signal.aborted) {
          return;
        }
        if (__DEV__) {
          console.warn("[chat-events] error", error);
        }
      }
    }

    function disconnect() {
      controller?.abort();
      controller = null;
    }

    if (AppState.currentState === "active") {
      void connect();
    }

    const subscription = AppState.addEventListener(
      "change",
      (status: AppStateStatus) => {
        if (status === "active") {
          void connect();
        } else {
          disconnect();
        }
      },
    );

    return () => {
      disconnect();
      subscription.remove();
    };
  }, [isAuthenticated]);
}
