import React, { useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { toast } from "sonner-native";
import { BackButton } from "@/components/ui/back-button";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { EditableAvatar } from "@/components/profile/editable-avatar";
import { ProfileInfo } from "@/components/profile/profile-info";
import { ChangeAvatarSheet } from "@/components/profile/change-avatar-sheet";
import { ProfileActions } from "@/components/profile/profile-actions";
import { ProfileQrModal } from "@/components/profile/profile-qr-modal";
import { useProfile } from "@/hooks/useProfile";
import { useUserProfile } from "@/hooks/useUserProfile";
import { shareProfile } from "@/lib/profile-link";
import { getErrorMessage } from "@/lib/utils/error";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { data: profile, isPending, error, refetch } = useProfile();
  // TODO(step 5.5): replace with the avatar upload mutation
  const { updateAvatar } = useUserProfile();
  const [avatarSheetVisible, setAvatarSheetVisible] = useState(false);
  const [qrModalVisible, setQrModalVisible] = useState(false);

  if (isPending) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View className="flex-1 justify-center items-center gap-4 px-6 bg-background">
        <BackButton
          className="absolute left-6"
          style={{ top: Math.max(insets.top + 8, 48) }}
        />
        <Text className="text-center">
          {getErrorMessage(error, "Couldn't load your profile")}
        </Text>
        <Button onPress={() => refetch()}>
          <Text>Retry</Text>
        </Button>
      </View>
    );
  }

  const handleShareProfile = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await shareProfile(profile.username);
    } catch {
      toast.error("Couldn't open the share dialog");
    }
  };

  return (
    <View className="flex-1 bg-background">
      <BackButton
        className="absolute left-6"
        style={{ top: Math.max(insets.top + 8, 48) }}
      />

      <View
        className="flex-1"
        style={{ paddingTop: Math.max(insets.top + 8, 48) + 40 }}
      >
        <EditableAvatar
          uri={profile.avatarUrl}
          fallbackText={`${profile.firstName} ${profile.lastName}`}
          onEdit={() => setAvatarSheetVisible(true)}
        />

        <ProfileInfo
          username={profile.username}
          email={profile.email}
          className="mt-4"
        />
      </View>

      <ProfileActions
        className="px-6"
        style={{ paddingBottom: insets.bottom + 24 }}
        onResetPassword={() => router.push("/change-password")}
        onEditProfile={() => router.push("/edit-profile")}
        onShareProfile={handleShareProfile}
        onShowQrCode={() => setQrModalVisible(true)}
      />

      <ProfileQrModal
        visible={qrModalVisible}
        onClose={() => setQrModalVisible(false)}
        profile={profile}
      />

      <ChangeAvatarSheet
        visible={avatarSheetVisible}
        onClose={() => setAvatarSheetVisible(false)}
        onPickImage={(asset) => updateAvatar(asset.uri)}
        onRemove={() => updateAvatar(null)}
        hasCurrentAvatar={Boolean(profile.avatarUrl)}
      />
    </View>
  );
}
