import { useSegments } from "expo-router";
import type { ProfileScope } from "@/lib/profile-link";

export function useProfileScope(): ProfileScope {
  const segments: string[] = useSegments();
  return segments[0] === "(tabs)" && segments[1] === "friends"
    ? "tabs"
    : "root";
}
