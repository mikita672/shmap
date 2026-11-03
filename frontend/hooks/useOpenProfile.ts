import { router } from "expo-router";
import { useProfile } from "@/hooks/useProfile";
import { useProfileScope } from "@/hooks/useProfileScope";
import { getProfileHref } from "@/lib/profile-link";
import type { UserSummaryResponse } from "@/lib/types/api";

export function useOpenProfile() {
  const { data: me } = useProfile();
  const scope = useProfileScope();

  return (user: UserSummaryResponse) => {
    if (user.id === me?.id) {
      router.push("/profile");
      return;
    }
    router.push(getProfileHref(user.username, scope));
  };
}
