import { infiniteQueryOptions, useInfiniteQuery } from "@tanstack/react-query";
import { getProfileRoutes } from "@/lib/api/profiles";
import { AuthErrorCode } from "@/lib/types/api";
import { isErrorCode } from "@/lib/utils/error";

const PROFILE_ROUTES_STALE_TIME_MS = 60_000;

const FINAL_ERRORS = [
  AuthErrorCode.PRIVATE_ACCOUNT,
  AuthErrorCode.USER_NOT_FOUND,
];

export const profileRoutesQueryOptions = (username: string) =>
  infiniteQueryOptions({
    queryKey: ["profiles", username, "routes"],
    queryFn: async ({ pageParam }) => {
      const { data } = await getProfileRoutes(username, pageParam);
      return data;
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: PROFILE_ROUTES_STALE_TIME_MS,
    enabled: Boolean(username),
    retry: (failureCount, error) =>
      !FINAL_ERRORS.some((code) => isErrorCode(error, code)) &&
      failureCount < 2,
  });

export function useProfileRoutes(username: string) {
  return useInfiniteQuery(profileRoutesQueryOptions(username));
}
