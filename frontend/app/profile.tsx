import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@/lib/icons";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThemeSwitch } from "@/components/theme-switch";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useAuth } from "@/hooks/useAuth";
import { ChangeAvatarSheet } from "@/components/profile/change-avatar-sheet";
import { ShareProfileModal } from "@/components/profile/share-profile-modal";
import { EditProfileModal } from "@/components/profile/edit-profile-modal";
import { ChangePasswordModal } from "@/components/profile/change-password-modal";

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { signOut } = useAuth();
  const { profile, updateProfile, updateAvatar } = useUserProfile();

  const [avatarSheetVisible, setAvatarSheetVisible] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out of Shmap?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => {
          signOut();
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-background">
      <View
        className="px-4 pb-3 flex-row items-center justify-between border-b border-border/30 bg-surface/80"
        style={{ paddingTop: Math.max(insets.top, 12) }}
      >
        <Pressable
          onPress={handleClose}
          className="h-10 w-10 rounded-full bg-muted/60 items-center justify-center active:opacity-70"
          accessibilityLabel="Go back"
        >
          <Ionicons
            name={Platform.OS === "ios" ? "chevron-back" : "arrow-back"}
            size={22}
            className="text-foreground"
          />
        </Pressable>

        <Text className="text-foreground font-bold text-lg">
          Profile & Settings
        </Text>

        <Pressable
          onPress={() => setShareModalVisible(true)}
          className="h-10 w-10 rounded-full bg-muted/60 items-center justify-center active:opacity-70"
          accessibilityLabel="Share profile"
        >
          <Ionicons
            name="qr-code-outline"
            size={20}
            className="text-foreground"
          />
        </Pressable>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="p-5 pb-16 gap-6"
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center bg-surface p-6 rounded-3xl border border-border/40 shadow-sm shadow-black/5">
          <Pressable
            onPress={() => setAvatarSheetVisible(true)}
            className="relative active:opacity-90"
            accessibilityLabel="Change avatar"
          >
            <Avatar
              size="2xl"
              uri={profile.avatarUrl}
              fallbackText={`${profile.firstName} ${profile.lastName}`}
              className="border-2 border-primary/20"
            />
            <View className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary items-center justify-center border-2 border-surface shadow-md">
              <Ionicons
                name="camera"
                size={16}
                className="text-primary-foreground"
              />
            </View>
          </Pressable>

          <Text className="text-foreground font-bold text-2xl mt-4 text-center">
            {profile.firstName} {profile.lastName}
          </Text>
          <Text className="text-on-surface-muted font-medium text-sm mt-0.5">
            @{profile.username}
          </Text>

          {Boolean(profile.bio) && (
            <Text className="text-on-surface text-center text-sm mt-2.5 px-4 leading-5">
              {profile.bio}
            </Text>
          )}

          <Button
            variant="outline"
            size="sm"
            className="rounded-full mt-4 h-9 px-4 gap-1.5"
            onPress={() => setAvatarSheetVisible(true)}
          >
            <Ionicons
              name="image-outline"
              size={16}
              className="text-foreground"
            />
            <Text className="text-foreground text-xs font-semibold">
              Change Avatar
            </Text>
          </Button>

          <View className="flex-row w-full gap-3 mt-5 pt-5 border-t border-border/30">
            <Button
              variant="secondary"
              className="flex-1 rounded-2xl h-11 flex-row items-center justify-center gap-2"
              onPress={() => setEditModalVisible(true)}
            >
              <Ionicons
                name="pencil-outline"
                size={16}
                className="text-secondary-foreground"
              />
              <Text className="text-secondary-foreground font-semibold text-sm">
                Edit Profile
              </Text>
            </Button>

            <Button
              variant="secondary"
              className="flex-1 rounded-2xl h-11 flex-row items-center justify-center gap-2"
              onPress={() => setShareModalVisible(true)}
            >
              <Ionicons
                name="share-outline"
                size={16}
                className="text-secondary-foreground"
              />
              <Text className="text-secondary-foreground font-semibold text-sm">
                Share QR
              </Text>
            </Button>
          </View>
        </View>

        <View className="gap-2">
          <Text className="text-on-surface-muted text-xs font-semibold uppercase tracking-wider px-2">
            Account
          </Text>
          <View className="bg-surface rounded-2xl border border-border/40 overflow-hidden divide-y divide-border/30">
            <Pressable
              className="flex-row items-center justify-between p-4 active:bg-muted/40"
              onPress={() => setEditModalVisible(true)}
            >
              <View className="flex-row items-center gap-3">
                <View className="h-9 w-9 rounded-xl bg-primary/10 items-center justify-center">
                  <Ionicons
                    name="person-outline"
                    size={18}
                    className="text-primary"
                  />
                </View>
                <View>
                  <Text className="text-foreground font-semibold text-sm">
                    Edit Profile
                  </Text>
                  <Text className="text-on-surface-muted text-xs">
                    Name, username, and bio
                  </Text>
                </View>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                className="text-on-surface-muted"
              />
            </Pressable>

            <Pressable
              className="flex-row items-center justify-between p-4 active:bg-muted/40"
              onPress={() => setPasswordModalVisible(true)}
            >
              <View className="flex-row items-center gap-3">
                <View className="h-9 w-9 rounded-xl bg-primary/10 items-center justify-center">
                  <Ionicons
                    name="lock-closed-outline"
                    size={18}
                    className="text-primary"
                  />
                </View>
                <View>
                  <Text className="text-foreground font-semibold text-sm">
                    Change Password
                  </Text>
                  <Text className="text-on-surface-muted text-xs">
                    Update your account security
                  </Text>
                </View>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                className="text-on-surface-muted"
              />
            </Pressable>
          </View>
        </View>

        <View className="gap-2">
          <Text className="text-on-surface-muted text-xs font-semibold uppercase tracking-wider px-2">
            Connect
          </Text>
          <View className="bg-surface rounded-2xl border border-border/40 overflow-hidden">
            <Pressable
              className="flex-row items-center justify-between p-4 active:bg-muted/40"
              onPress={() => setShareModalVisible(true)}
            >
              <View className="flex-row items-center gap-3">
                <View className="h-9 w-9 rounded-xl bg-primary/10 items-center justify-center">
                  <Ionicons
                    name="qr-code-outline"
                    size={18}
                    className="text-primary"
                  />
                </View>
                <View>
                  <Text className="text-foreground font-semibold text-sm">
                    Share Profile & QR Code
                  </Text>
                  <Text className="text-on-surface-muted text-xs">
                    Let friends scan or send direct link
                  </Text>
                </View>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                className="text-on-surface-muted"
              />
            </Pressable>
          </View>
        </View>

        <View className="gap-2">
          <Text className="text-on-surface-muted text-xs font-semibold uppercase tracking-wider px-2">
            Appearance
          </Text>
          <View className="bg-surface rounded-2xl p-4 border border-border/40 gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-foreground font-semibold text-sm">
                App Theme
              </Text>
              <Text className="text-on-surface-muted text-xs">
                Light, Dark, or System
              </Text>
            </View>
            <ThemeSwitch />
          </View>
        </View>

        <View className="pt-2">
          <Button
            variant="destructive"
            className="w-full h-12 rounded-2xl flex-row items-center justify-center gap-2"
            onPress={handleSignOut}
          >
            <Ionicons name="log-out-outline" size={18} className="text-white" />
            <Text className="text-white font-semibold text-base">Sign Out</Text>
          </Button>
        </View>
      </ScrollView>

      <ChangeAvatarSheet
        visible={avatarSheetVisible}
        onClose={() => setAvatarSheetVisible(false)}
        onSelectAvatar={updateAvatar}
        hasCurrentAvatar={Boolean(profile.avatarUrl)}
      />

      <ShareProfileModal
        visible={shareModalVisible}
        onClose={() => setShareModalVisible(false)}
        profile={profile}
      />

      <EditProfileModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        profile={profile}
        onSave={updateProfile}
      />

      <ChangePasswordModal
        visible={passwordModalVisible}
        onClose={() => setPasswordModalVisible(false)}
      />
    </View>
  );
}
