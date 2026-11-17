import {
  queryOptions,
  useMutation,
  useMutationState,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getRouteSuggestions, suggestRoutePlaces } from "@/lib/api/routes";
import { AuthErrorCode, type SuggestRequest } from "@/lib/types/api";
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

const suggestMutationKey = (routeId: number) => ["routes", routeId, "suggest"];

export function useSuggestPlaces(routeId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: suggestMutationKey(routeId),
    mutationFn: async (request: SuggestRequest) => {
      const response = await suggestRoutePlaces(routeId, request);
      return response.data;
    },
    onSuccess: (suggestions) => {
      queryClient.setQueryData(
        routeSuggestionsQueryOptions(routeId).queryKey,
        suggestions,
      );
    },
  });
}

export function useSuggestStatus(routeId: number) {
  const states = useMutationState({
    filters: { mutationKey: suggestMutationKey(routeId) },
    select: (mutation) => mutation.state,
  });
  const latest = states[states.length - 1];

  return {
    isAsking: states.some((state) => state.status === "pending"),
    error: latest?.status === "error" ? latest.error : null,
  };
}
