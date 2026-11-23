import { useCallback } from "react";
import {
  queryOptions,
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
import { getPublicProfile } from "@/lib/api/profiles";
import { AuthErrorCode } from "@/lib/types/api";
import { isErrorCode } from "@/lib/utils/error";

export const publicProfileQueryOptions = (username: string) =>
  queryOptions({
    queryKey: ["profiles", username],
    queryFn: async () => {
      const { data } = await getPublicProfile(username);
      return data;
    },
    enabled: Boolean(username),
    retry: (failureCount, error) =>
      !isErrorCode(error, AuthErrorCode.USER_NOT_FOUND) && failureCount < 2,
  });

export function usePublicProfile(username: string) {
  return useQuery(publicProfileQueryOptions(username));
}

export function markProfilesStale(queryClient: QueryClient) {
  return queryClient.invalidateQueries({
    queryKey: ["profiles"],
    refetchType: "none",
  });
}

export function useRefetchInvalidatedProfile(username: string) {
  const queryClient = useQueryClient();
  useRefreshOnFocus(
    useCallback(
      () =>
        queryClient.refetchQueries({
          queryKey: publicProfileQueryOptions(username).queryKey,
          exact: true,
          predicate: (query) => query.state.isInvalidated,
        }),
      [queryClient, username],
    ),
  );
}
