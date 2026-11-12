import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { getOpenChatId } from "@/lib/open-chat";
import { enqueuePermissionRequest } from "@/lib/permission-queue";

export const MESSAGES_CHANNEL_ID = "messages";

const PERMISSION_ASKED_KEY = "notification-permission-asked";

async function ensureMessagesChannel() {
  if (Platform.OS !== "android") {
    return;
  }
  await Notifications.setNotificationChannelAsync(MESSAGES_CHANNEL_ID, {
    name: "Messages",
    importance: Notifications.AndroidImportance.HIGH,
  });
}

async function ensurePermission() {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) {
    return true;
  }
  if (!current.canAskAgain) {
    return false;
  }
  if (await AsyncStorage.getItem(PERMISSION_ASKED_KEY)) {
    return false;
  }

  const result = await enqueuePermissionRequest(async () => {
    if (await AsyncStorage.getItem(PERMISSION_ASKED_KEY)) {
      return Notifications.getPermissionsAsync();
    }
    const requested = await Notifications.requestPermissionsAsync();
    await AsyncStorage.setItem(PERMISSION_ASKED_KEY, "true");
    return requested;
  });
  return result.granted;
}

export async function getExpoPushToken(
  devicePushToken?: Notifications.DevicePushToken,
) {
  await ensureMessagesChannel();
  if (!(await ensurePermission())) {
    return null;
  }

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId;
  if (!projectId) {
    throw new Error("EAS project ID is missing");
  }

  const { data } = await Notifications.getExpoPushTokenAsync({
    projectId,
    devicePushToken,
  });
  return data;
}

export type PushData = {
  type: "chat.message" | "chat.added";
  chatId: number;
};

export function parsePushData(data: unknown): PushData | null {
  if (typeof data !== "object" || data === null) {
    return null;
  }
  const { type, chatId } = data as Record<string, unknown>;
  if (type !== "chat.message" && type !== "chat.added") {
    return null;
  }
  const id = Number(chatId);
  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }
  return { type, chatId: id };
}

export function setUpNotificationHandler() {
  Notifications.setNotificationHandler({
    handleNotification: async (notification) => {
      const data = parsePushData(notification.request.content.data);
      const isOpenChat = data !== null && data.chatId === getOpenChatId();
      return {
        shouldShowBanner: false,
        shouldShowList: !isOpenChat,
        shouldPlaySound: false,
        shouldSetBadge: false,
      };
    },
  });
}

export async function dismissChatNotifications(chatId: number) {
  const presented = await Notifications.getPresentedNotificationsAsync();
  await Promise.all(
    presented
      .filter(
        (notification) =>
          parsePushData(notification.request.content.data)?.chatId === chatId,
      )
      .map((notification) =>
        Notifications.dismissNotificationAsync(notification.request.identifier),
      ),
  );
}
