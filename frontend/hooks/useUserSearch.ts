import { useQuery } from "@tanstack/react-query";
import { searchUsers } from "@/lib/api/users";

export function useUserSearch(query: string) {
  const text = query.trim();

  return useQuery({
    queryKey: ["users", "search", text],
    queryFn: async () => {
      const { data } = await searchUsers(text);
      return data;
    },
    staleTime: 0,
  });
}
