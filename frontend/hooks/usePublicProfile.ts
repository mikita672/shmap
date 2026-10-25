import { queryOptions, useQuery } from "@tanstack/react-query";
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
