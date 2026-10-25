import { queryOptions, useQuery } from "@tanstack/react-query";
import { getChats } from "@/lib/api/chats";

export const chatsQueryOptions = queryOptions({
  queryKey: ["chats"],
  queryFn: async () => {
    const { data } = await getChats();
    return data;
  },
});

export function useChats() {
  return useQuery(chatsQueryOptions);
}
