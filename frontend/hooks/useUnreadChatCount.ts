import { queryOptions, useQuery } from "@tanstack/react-query";
import { getUnreadChatCount } from "@/lib/api/chats";

export const unreadChatCountQueryOptions = queryOptions({
  queryKey: ["chats", "unread", "count"],
  queryFn: async () => {
    const { data } = await getUnreadChatCount();
    return data.count;
  },
});

export function useUnreadChatCount() {
  return useQuery(unreadChatCountQueryOptions);
}
