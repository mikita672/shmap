import { queryOptions, useQuery } from "@tanstack/react-query";
import { getRoute } from "@/lib/api/routes";
import { AuthErrorCode } from "@/lib/types/api";
import { isErrorCode } from "@/lib/utils/error";

export const routeQueryOptions = (routeId: number) =>
  queryOptions({
    queryKey: ["routes", routeId],
    queryFn: async () => {
      const { data } = await getRoute(routeId);
      return data;
    },
    retry: (failureCount, error) =>
      !isErrorCode(error, AuthErrorCode.ROUTE_NOT_FOUND) && failureCount < 2,
  });

export function useRoute(routeId: number) {
  return useQuery(routeQueryOptions(routeId));
}
