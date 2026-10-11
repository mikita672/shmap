import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { checkUsernameAvailability } from "@/lib/api/users";
import { validateProfileField } from "@/lib/validation/profile";

const DEBOUNCE_MS = 400;

function shouldCheck(username: string, currentUsername: string): boolean {
  return (
    username !== currentUsername &&
    validateProfileField("username", username) === undefined
  );
}

export function useUsernameAvailability(
  username: string,
  currentUsername: string,
) {
  const trimmed = username.trim();
  const [debouncedUsername, setDebouncedUsername] = useState(trimmed);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedUsername(trimmed), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [trimmed]);

  const { data, isFetching } = useQuery({
    queryKey: ["username-availability", debouncedUsername],
    queryFn: async () => {
      const { data } = await checkUsernameAvailability(debouncedUsername);
      return data;
    },
    enabled: shouldCheck(debouncedUsername, currentUsername),
  });

  const isRelevant = shouldCheck(trimmed, currentUsername);
  const isSettled = trimmed === debouncedUsername;

  return {
    isChecking: isRelevant && (!isSettled || isFetching),
    isTaken: isRelevant && isSettled && data?.available === false,
  };
}
