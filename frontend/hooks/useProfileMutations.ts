import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileQueryOptions } from "@/hooks/useProfile";
import { updateMe } from "@/lib/api/users";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMe,
    onSuccess: (response) => {
      queryClient.setQueryData(profileQueryOptions.queryKey, response.data);
    },
  });
}
