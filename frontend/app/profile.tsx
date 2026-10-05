import React, { useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { toast } from "sonner-native";
import { BackButton } from "@/components/ui/back-button";
import { EditableAvatar } from "@/components/profile/editable-avatar";
import { ProfileInfo } from "@/components/profile/profile-info";
import { ChangeAvatarSheet } from "@/components/profile/change-avatar-sheet";
import { ProfileActions } from "@/components/profile/profile-actions";
import { ProfileQrModal } from "@/components/profile/profile-qr-modal";
import { useProfile } from "@/hooks/useProfile";
import { useUserProfile } from "@/hooks/useUserProfile";
import { shareProfile } from "@/lib/profile-link";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { data: profile } = useProfile();
  // TODO(step 5.5): replace with the avatar upload mutation
  const { updateAvatar } = useUserProfile();
  const [avatarSheetVisible, setAvatarSheetVisible] = useState(false);
  const [qrModalVisible, setQrModalVisible] = useState(false);

  // TODO(step 2.4): show a loading indicator instead of a blank screen
  if (!profile) {
    return null;
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
        onSelectAvatar={updateAvatar}
        hasCurrentAvatar={Boolean(profile.avatarUrl)}
      />
    </View>
  );
}
