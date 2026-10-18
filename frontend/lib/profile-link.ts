import { Platform, Share, type ShareContent } from "react-native";
import type { Href } from "expo-router";

import { isValidUsername } from "@/lib/validation/profile";

const SHARE_ORIGIN = "https://shmap.dev";
const SHARE_MESSAGE = "Add me on Shmap!";
const PROFILE_LINK_PATTERN =
  /^(?:https:\/\/shmap\.dev|shmap:\/)\/u\/([^/?#]+)\/?(?:[?#].*)?$/;

export function getProfileUrl(username: string): string {
  return `${SHARE_ORIGIN}/u/${encodeURIComponent(username)}`;
}

export function getProfileHref(username: string): Href {
  return { pathname: "/friends/profile/[username]", params: { username } };
}

export function parseProfileLink(text: string): string | null {
  const match = text.trim().match(PROFILE_LINK_PATTERN);
  if (!match) {
    return null;
  }

  const username = match[1];
  return isValidUsername(username) ? username : null;
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
