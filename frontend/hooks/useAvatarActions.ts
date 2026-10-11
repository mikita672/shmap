import * as Haptics from "expo-haptics";
import type { ImagePickerAsset } from "expo-image-picker";
import { toast } from "sonner-native";
import { useRemoveAvatar, useUploadAvatar } from "@/hooks/useProfileMutations";
import { getErrorMessage } from "@/lib/utils/error";

export function useAvatarActions() {
  const uploadAvatar = useUploadAvatar();
  const removeAvatar = useRemoveAvatar();

  const pickImage = (asset: ImagePickerAsset) => {
    uploadAvatar.mutate(asset, {
      onSuccess: () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        toast.success("Avatar updated");
      },
      onError: (error) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        toast.error(getErrorMessage(error, "Couldn't update your avatar"));
      },
    });
  };

  const remove = () => {
    removeAvatar.mutate(undefined, {
      onSuccess: () => toast.success("Avatar removed"),
      onError: (error) =>
        toast.error(getErrorMessage(error, "Couldn't remove your avatar")),
    });
  };

  return {
    pickImage,
    remove,
    isPending: uploadAvatar.isPending || removeAvatar.isPending,
  };
}
