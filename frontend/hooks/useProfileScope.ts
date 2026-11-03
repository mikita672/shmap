import { useSegments } from "expo-router";
import type { ProfileScope } from "@/lib/profile-link";

export function useProfileScope(): ProfileScope {
  const [first, second] = useSegments();
  return first === "(tabs)" && second === "friends" ? "tabs" : "root";
}
