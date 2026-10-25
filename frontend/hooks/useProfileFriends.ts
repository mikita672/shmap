import { queryOptions, useQuery } from "@tanstack/react-query";
import { getProfileFriends } from "@/lib/api/profiles";
import { AuthErrorCode } from "@/lib/types/api";
import { isErrorCode } from "@/lib/utils/error";

const FINAL_ERRORS = [
  AuthErrorCode.PRIVATE_ACCOUNT,
  AuthErrorCode.FRIENDS_LIST_HIDDEN,
  AuthErrorCode.USER_NOT_FOUND,
];

export const profileFriendsQueryOptions = (username: string) =>
  queryOptions({
    queryKey: ["profiles", username, "friends"],
    queryFn: async () => {
      const { data } = await getProfileFriends(username);
      return data;
    },
    retry: (failureCount, error) =>
      !FINAL_ERRORS.some((code) => isErrorCode(error, code)) &&
      failureCount < 2,
  });

export function useProfileFriends(username: string) {
  return useQuery(profileFriendsQueryOptions(username));
}
