import { useEffect } from "react";
import { Redirect, useLocalSearchParams } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { getProfileHref } from "@/lib/profile-link";
import { isValidUsername } from "@/lib/validation/profile";

export default function ProfileLinkScreen() {
  const { username } = useLocalSearchParams<{ username: string }>();
  const { isAuthenticated, setPendingLink } = useAuth();
  const isValid = isValidUsername(username);

  useEffect(() => {
    if (isValid && !isAuthenticated) {
      setPendingLink(getProfileHref(username));
    }
  }, [isValid, isAuthenticated, username, setPendingLink]);

  if (!isValid) {
    return <Redirect href="/" />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return <Redirect href={getProfileHref(username)} withAnchor />;
}
