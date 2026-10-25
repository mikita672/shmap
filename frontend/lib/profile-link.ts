import { Platform, Share, type ShareContent } from "react-native";
import type { Href } from "expo-router";

import { isValidUsername } from "@/lib/validation/profile";

const SHARE_ORIGIN = "https://shmap.dev";
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

export function shareProfile(username: string, name?: string) {
  const url = getProfileUrl(username);
  const message = name ? `Add ${name} on Shmap!` : "Add me on Shmap!";
  const content: ShareContent =
    Platform.OS === "ios"
      ? { message, url }
      : { title: "Shmap profile", message: `${message} ${url}` };

  return Share.share(content, {
    dialogTitle: "Share profile",
    subject: name ? `${name} on Shmap` : "My Shmap profile",
  });
}
