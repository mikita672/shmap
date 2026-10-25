import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getAccessToken } from "@/lib/api/client";
import { readEventStream } from "@/lib/api/events";

export function useChatEvents() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const controller = new AbortController();

    async function stream() {
      try {
        const token = await getAccessToken();
        if (!token || controller.signal.aborted) {
          return;
        }

        await readEventStream({
          token,
          signal: controller.signal,
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
        if (controller.signal.aborted) {
          return;
        }
        if (__DEV__) {
          console.warn("[chat-events] error", error);
        }
      }
    }

    void stream();

    return () => {
      controller.abort();
    };
  }, [isAuthenticated]);
}
