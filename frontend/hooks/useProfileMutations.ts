import { useMutation, useQueryClient } from "@tanstack/react-query";
import { File } from "expo-file-system";
import type { ImagePickerAsset } from "expo-image-picker";
import { useAuth } from "@/hooks/useAuth";
import { profileQueryOptions } from "@/hooks/useProfile";
import { uploadFile } from "@/lib/api/upload";
import {
  changeEmail,
  confirmAvatar,
  createAvatarUploadUrl,
  updateMe,
} from "@/lib/api/users";
import { validateAvatar } from "@/lib/validation/avatar";

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

export function useUploadAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (asset: ImagePickerAsset) => {
      const file = new File(asset.uri);
      const contentType = asset.mimeType || file.type;
      const contentLength = file.size;

      const validationError = validateAvatar(contentType, contentLength);
      if (validationError) throw new Error(validationError);

      const { data: upload } = await createAvatarUploadUrl({
        contentType,
        contentLength,
      });
      await uploadFile(upload.uploadUrl, asset.uri, contentType);
      const { data: profile } = await confirmAvatar({ key: upload.key });
      return profile;
    },
    onSuccess: (profile) => {
      queryClient.setQueryData(profileQueryOptions.queryKey, profile);
    },
  });
}
