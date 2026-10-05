import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { profileQueryOptions } from "@/hooks/useProfile";
import { changeEmail, updateMe } from "@/lib/api/users";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMe,
    onSuccess: (response) => {
      queryClient.setQueryData(profileQueryOptions.queryKey, response.data);
    },
  });
}

export function useChangeEmail() {
  const queryClient = useQueryClient();
  const { signIn } = useAuth();

  return useMutation({
    mutationFn: changeEmail,
    onSuccess: async (response) => {
      await signIn(response.data);
      await queryClient.invalidateQueries({
        queryKey: profileQueryOptions.queryKey,
      });
    },
  });
}
