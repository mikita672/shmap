import React from "react";
import { Modal, View, Text, Pressable, Share } from "react-native";
import QRCode from "react-native-qrcode-svg";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@/lib/icons";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner-native";
import type { UserProfile } from "@/hooks/useUserProfile";

interface ShareProfileModalProps {
  visible: boolean;
  onClose: () => void;
  profile: UserProfile;
}

export function ShareProfileModal({
  visible,
  onClose,
  profile,
}: ShareProfileModalProps) {
  const profileUrl = `https://shmap.app/u/${profile.username}`;

  const handleCopyLink = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await Clipboard.setStringAsync(profileUrl);
    toast.success("Profile link copied to clipboard!");
  };

  const handleShare = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await Share.share({
        title: `Connect with ${profile.firstName} on Shmap`,
        message: `Add me on Shmap! Check out my profile: ${profileUrl}`,
        url: profileUrl,
      });
    } catch (err) {
      console.warn("Error sharing profile:", err);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/60 justify-center items-center px-5">
        <View className="w-full max-w-sm bg-surface rounded-3xl p-6 items-center shadow-xl border border-border/50">
          <View className="w-full flex-row justify-between items-center mb-4">
            <Text className="text-foreground text-lg font-bold">
              Share Profile
            </Text>
            <Pressable
              onPress={onClose}
              className="h-8 w-8 rounded-full bg-muted/60 items-center justify-center active:opacity-70"
              accessibilityLabel="Close share profile modal"
            >
              <Ionicons name="close" size={18} className="text-foreground" />
            </Pressable>
          </View>

          <View className="items-center mb-6">
            <Avatar
              size="xl"
              uri={profile.avatarUrl}
              fallbackText={`${profile.firstName} ${profile.lastName}`}
              className="mb-3 border-2 border-primary"
            />
            <Text className="text-foreground font-bold text-xl text-center">
              {profile.firstName} {profile.lastName}
            </Text>
            <Text className="text-on-surface-muted text-sm font-medium">
              @{profile.username}
            </Text>
          </View>

          <View className="p-4 bg-white rounded-2xl shadow-md border border-neutral-200 items-center justify-center mb-6">
            <QRCode
              value={profileUrl}
              size={180}
              color="#0f172a"
              backgroundColor="#ffffff"
            />
          </View>

          <Text className="text-on-surface-muted text-xs text-center mb-6 px-4">
            Scan this QR code with a camera to instantly view and add{" "}
            {profile.firstName} on Shmap.
          </Text>

          <View className="w-full gap-3">
            <Button
              className="w-full h-12 rounded-xl flex-row items-center justify-center gap-2"
              onPress={handleShare}
            >
              <Ionicons
                name="share-social-outline"
                size={18}
                className="text-white"
              />
              <Text className="text-white font-semibold">
                Share Profile Link
              </Text>
            </Button>

            <Button
              variant="outline"
              className="w-full h-12 rounded-xl flex-row items-center justify-center gap-2"
              onPress={handleCopyLink}
            >
              <Ionicons
                name="copy-outline"
                size={18}
                className="text-foreground"
              />
              <Text className="text-foreground font-medium">Copy Link</Text>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}
