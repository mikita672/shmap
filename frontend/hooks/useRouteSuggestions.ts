import { queryOptions, useQuery } from "@tanstack/react-query";
import { getRouteSuggestions } from "@/lib/api/routes";
import { AuthErrorCode } from "@/lib/types/api";
import { isErrorCode } from "@/lib/utils/error";

export const routeSuggestionsQueryOptions = (routeId: number) =>
  queryOptions({
    queryKey: ["routes", routeId, "suggestions"],
    queryFn: async () => {
      try {
        const { data } = await getRouteSuggestions(routeId);
        return data;
      } catch (error) {
        if (isErrorCode(error, AuthErrorCode.ROUTE_SUGGESTIONS_NOT_FOUND)) {
          return null;
        }
        throw error;
      }
    },
    retry: (failureCount, error) =>
      !isErrorCode(error, AuthErrorCode.ROUTE_NOT_FOUND) && failureCount < 2,
  });

export function useRouteSuggestions(routeId: number, enabled = true) {
  return useQuery({ ...routeSuggestionsQueryOptions(routeId), enabled });
}
