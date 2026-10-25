import { hasSearchText, matchesFriendSearch } from "@/lib/friend-search";
import type { ChatSummaryResponse } from "@/lib/types/api";

export function matchesChatSearch(
  chat: ChatSummaryResponse,
  query: string,
): boolean {
  if (!hasSearchText(query)) return true;

  if (chat.type === "DIRECT") {
    return matchesFriendSearch({ user: chat.otherUser }, query);
  }

  const text = query.trim().toLocaleLowerCase();
  return !text.startsWith("@") && chat.name.toLocaleLowerCase().includes(text);
}
