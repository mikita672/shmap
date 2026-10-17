import type { FriendResponse } from "@/lib/types/api";

export function matchesFriendSearch(
  { user }: FriendResponse,
  query: string,
): boolean {
  const text = query.trim().toLocaleLowerCase();
  const username = user.username.toLocaleLowerCase();

  if (text.startsWith("@")) {
    return username.startsWith(text.slice(1).trim());
  }

  const fullName = `${user.firstName} ${user.lastName}`.toLocaleLowerCase();
  return fullName.includes(text) || username.includes(text);
}
