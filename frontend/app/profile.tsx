import React, { useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { BackButton } from "@/components/ui/back-button";
import { EditableAvatar } from "@/components/profile/editable-avatar";
import { ProfileInfo } from "@/components/profile/profile-info";
import { ChangeAvatarSheet } from "@/components/profile/change-avatar-sheet";
import { ProfileActions } from "@/components/profile/profile-actions";
import { useUserProfile } from "@/hooks/useUserProfile";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { profile, updateAvatar } = useUserProfile();
  const [avatarSheetVisible, setAvatarSheetVisible] = useState(false);

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
