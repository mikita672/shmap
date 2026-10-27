import { useEffect } from "react";
import { AppState, type AppStateStatus } from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { chatQueryOptions } from "@/hooks/useChat";
import { chatsQueryOptions } from "@/hooks/useChats";
import { profileQueryOptions } from "@/hooks/useProfile";
import { getAccessToken, refreshAccessToken } from "@/lib/api/client";
import {
  addMessageToCache,
  addMessageToChatList,
  applyChatRead,
} from "@/lib/chat-cache";
import { EventStreamError, readEventStream } from "@/lib/api/events";
import { getOpenChatId } from "@/lib/open-chat";
import type { ChatMessageResponse, ChatReadEvent } from "@/lib/types/api";

export function useChatEvents() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

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
    let tokenJustRefreshed = false;

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
              tokenJustRefreshed = false;
              retryDelay = 1000;
              void queryClient.invalidateQueries({
                queryKey: ["chats"],
              });
              return;
            }

            if (event.event === "chat.message") {
              try {
                const { chatId, message } = JSON.parse(event.data) as {
                  chatId: number;
                  message: ChatMessageResponse;
                };
                const myId = queryClient.getQueryData(
                  profileQueryOptions.queryKey,
                )?.id;
                const countAsUnread =
                  message.sender.id !== myId && chatId !== getOpenChatId();
                addMessageToCache(queryClient, chatId, message);
                addMessageToChatList(
                  queryClient,
                  chatId,
                  message,
                  countAsUnread,
                );
              } catch {}
              return;
            }

            if (event.event === "chat.read") {
              try {
                applyChatRead(
                  queryClient,
                  JSON.parse(event.data) as ChatReadEvent,
                );
              } catch {}
              return;
            }

            if (event.event === "chat.changed") {
              try {
                const { chatId } = JSON.parse(event.data) as {
                  chatId: number;
                };
                void queryClient.invalidateQueries({
                  queryKey: chatsQueryOptions.queryKey,
                  exact: true,
                });
                void queryClient.invalidateQueries({
                  queryKey: chatQueryOptions(chatId).queryKey,
                  exact: true,
                });
              } catch {}
              return;
            }
          },
          onComment: () => {
            resetWatchdog(currentController);
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
        if (
          !isActive ||
          (currentController.signal.aborted && !isWatchdogDrop)
        ) {
          return;
        }

        if (error instanceof EventStreamError && error.status === 401) {
          try {
            const storedToken = await getAccessToken();
            if (storedToken && storedToken !== token) {
              scheduleRetry(0);
              return;
            }
            if (!tokenJustRefreshed) {
              await refreshAccessToken();
              tokenJustRefreshed = true;
              scheduleRetry(0);
              return;
            }
          } catch {}
        }

        const delay = retryDelay;
        retryDelay = Math.min(retryDelay * 2, 30_000);
        scheduleRetry(delay);
      }
    }

    function disconnect() {
      isActive = false;
      tokenJustRefreshed = false;
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
          tokenJustRefreshed = false;
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
  }, [isAuthenticated, queryClient]);
}
