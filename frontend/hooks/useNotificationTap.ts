import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import { router, useSegments } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { getOpenChatId } from "@/lib/open-chat";
import { parsePushData } from "@/lib/notifications";

export function useNotificationTap() {
  const { isAuthenticated, isLoading } = useAuth();
  const hasLeftIndex = useSegments().length > 0;
  const response = Notifications.useLastNotificationResponse();

  useEffect(() => {
    if (!response || isLoading) {
      return;
    }
    if (response.actionIdentifier !== Notifications.DEFAULT_ACTION_IDENTIFIER) {
      return;
    }
    if (isAuthenticated && !hasLeftIndex) {
      return;
    }

    Notifications.clearLastNotificationResponse();

    if (!isAuthenticated) {
      return;
    }

    const data = parsePushData(response.notification.request.content.data);
    if (!data || data.chatId === getOpenChatId()) {
      return;
    }

    if (router.canDismiss()) {
      router.dismissAll();
    }
    router.navigate("/chats");
    router.push({
      pathname: "/chat/[chatId]",
      params: { chatId: String(data.chatId) },
    });
  }, [response, isLoading, isAuthenticated, hasLeftIndex]);
}
