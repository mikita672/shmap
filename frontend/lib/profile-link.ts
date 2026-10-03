import { Platform, Share, type ShareContent } from "react-native";

const SHARE_MESSAGE = "Add me on Shmap!";

export function getProfileUrl(username: string): string {
  return `https://shmap.app/u/${encodeURIComponent(username)}`;
}

export function shareProfile(username: string) {
  const url = getProfileUrl(username);
  const content: ShareContent =
    Platform.OS === "ios"
      ? { message: SHARE_MESSAGE, url }
      : { title: "Shmap profile", message: `${SHARE_MESSAGE} ${url}` };

  return Share.share(content, {
    dialogTitle: "Share profile",
    subject: "My Shmap profile",
  });
}
