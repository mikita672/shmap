import { Redirect, useLocalSearchParams } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { isValidUsername } from "@/lib/validation/profile";

export default function ProfileLinkScreen() {
  const { username } = useLocalSearchParams<{ username: string }>();
  const { isAuthenticated } = useAuth();

  if (!isValidUsername(username)) {
    return <Redirect href="/" />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <Redirect
      href={{ pathname: "/friends/profile/[username]", params: { username } }}
      withAnchor
    />
  );
}
