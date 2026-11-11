import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
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

  await AsyncStorage.setItem(PERMISSION_ASKED_KEY, "true");
  const requested = await enqueuePermissionRequest(() =>
    Notifications.requestPermissionsAsync(),
  );
  return requested.granted;
}

export async function getExpoPushToken() {
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

  const { data } = await Notifications.getExpoPushTokenAsync({ projectId });
  return data;
}
