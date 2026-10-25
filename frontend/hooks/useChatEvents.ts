import { useEffect } from "react";
import { AppState, type AppStateStatus } from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { getAccessToken, refreshAccessToken } from "@/lib/api/client";
import { EventStreamError, readEventStream } from "@/lib/api/events";

export function useChatEvents() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    let isActive = AppState.currentState === "active";
    let retryDelay = 1000;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;
    let watchdogTimer: ReturnType<typeof setTimeout> | null = null;
    let controller: AbortController | null = null;
    let isWatchdogDrop = false;

    function clearWatchdog() {
      if (watchdogTimer) {
        clearTimeout(watchdogTimer);
        watchdogTimer = null;
      }
    }

    function resetWatchdog(currentController: AbortController) {
      clearWatchdog();
      watchdogTimer = setTimeout(() => {
        isWatchdogDrop = true;
        currentController.abort();
      }, 45_000);
    }

    function scheduleRetry(delay: number) {
      if (!isActive) {
        return;
      }
      if (retryTimer) {
        clearTimeout(retryTimer);
      }
      retryTimer = setTimeout(() => {
        retryTimer = null;
        void connect();
      }, delay);
    }

    async function connect() {
      if (!isActive) {
        return;
      }

      if (retryTimer) {
        clearTimeout(retryTimer);
        retryTimer = null;
      }
      clearWatchdog();
      isWatchdogDrop = false;

      controller?.abort();
      const currentController = new AbortController();
      controller = currentController;

      let token: string | null = null;
      try {
        token = await getAccessToken();
        if (!token || currentController.signal.aborted || !isActive) {
          return;
        }

        resetWatchdog(currentController);

        await readEventStream({
          token,
          signal: currentController.signal,
          onEvent: (event) => {
            resetWatchdog(currentController);
            if (event.event === "ready") {
              retryDelay = 1000;
            }
            if (__DEV__) {
              console.log("[chat-events]", event.event ?? "message", event.data);
            }
          },
          onComment: (comment) => {
            resetWatchdog(currentController);
            if (__DEV__) {
              console.log("[chat-events] comment", comment);
            }
          },
        });

        clearWatchdog();
        if (isActive && (!currentController.signal.aborted || isWatchdogDrop)) {
          const delay = retryDelay;
          retryDelay = Math.min(retryDelay * 2, 30_000);
          scheduleRetry(delay);
        }
      } catch (error) {
        clearWatchdog();
        if (!isActive || (currentController.signal.aborted && !isWatchdogDrop)) {
          return;
        }

        if (error instanceof EventStreamError && error.status === 401) {
          try {
            const storedToken = await getAccessToken();
            if (storedToken && storedToken !== token) {
              scheduleRetry(0);
              return;
            }
            await refreshAccessToken();
            scheduleRetry(0);
            return;
          } catch {}
        }

        if (__DEV__) {
          console.warn("[chat-events] error", error);
        }

        const delay = retryDelay;
        retryDelay = Math.min(retryDelay * 2, 30_000);
        scheduleRetry(delay);
      }
    }

    function disconnect() {
      isActive = false;
      if (retryTimer) {
        clearTimeout(retryTimer);
        retryTimer = null;
      }
      clearWatchdog();
      controller?.abort();
      controller = null;
    }

    if (isActive) {
      void connect();
    }

    const subscription = AppState.addEventListener(
      "change",
      (status: AppStateStatus) => {
        if (status === "active") {
          isActive = true;
          retryDelay = 1000;
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
