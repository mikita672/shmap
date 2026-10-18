import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { searchUsers } from "@/lib/api/users";

const SEARCH_DEBOUNCE_MS = 300;

export function useUserSearch(query: string) {
  const text = useDebouncedValue(query.trim(), SEARCH_DEBOUNCE_MS);

  return useQuery({
    queryKey: ["users", "search", text],
    queryFn: async () => {
      const { data } = await searchUsers(text);
      return data;
    },
    staleTime: 0,
    placeholderData: keepPreviousData,
  });
}
