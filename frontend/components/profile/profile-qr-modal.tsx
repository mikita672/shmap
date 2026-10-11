import { Modal, Pressable, View } from "react-native";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { toast } from "sonner-native";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { MaterialIcons } from "@/lib/icons";
import { getProfileUrl } from "@/lib/profile-link";
import { QRCode } from "@/lib/qr-code";
import type { ProfileResponse } from "@/lib/types/api";

const QR_SIZE = 208;

export interface ProfileQrModalProps {
  visible: boolean;
  onClose: () => void;
  profile: Pick<
    ProfileResponse,
    "firstName" | "lastName" | "username" | "avatarUrl"
  >;
}

export function ProfileQrModal({
  visible,
  onClose,
  profile,
}: ProfileQrModalProps) {
  const fullName = `${profile.firstName} ${profile.lastName}`;
  const profileUrl = getProfileUrl(profile.username);

  const handleCopyLink = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await Clipboard.setStringAsync(profileUrl);
    toast.success("Profile link copied to clipboard!");
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center justify-center px-6">
        <Pressable
          className="absolute inset-0 bg-black/60"
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close QR code"
        />

        <View
          accessibilityViewIsModal
          className="w-full max-w-[344px] items-center gap-4 rounded-[32px] bg-card px-6 pt-8 pb-6"
        >
          <Pressable
            onPress={onClose}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Close"
            className="absolute right-4 top-4 h-10 w-10 items-center justify-center rounded-full bg-action active:opacity-70"
          >
            <MaterialIcons
              name="close"
              size={24}
              className="text-action-foreground"
            />
          </Pressable>

          <Avatar
            uri={profile.avatarUrl}
            fallbackText={fullName}
            className="h-[72px] w-[72px]"
          />

          <View className="items-center gap-0.5">
            <Text className="text-card-title text-2xl leading-8 tracking-[0.5px] text-center">
              {fullName}
            </Text>
            <Text className="text-card-muted leading-6 tracking-[0.5px] text-center">
              @{profile.username}
            </Text>
          </View>

          <View
            className="rounded-3xl bg-qr-tile p-5"
            accessibilityRole="image"
            accessibilityLabel={`QR code linking to ${profileUrl}`}
          >
            <QRCode
              value={profileUrl}
              size={QR_SIZE}
              className="text-qr-code"
              backgroundColor="transparent"
              quietZone={0}
            />
          </View>

          <Text className="text-card-muted text-sm leading-5 tracking-[0.5px] text-center">
            Scan to open my profile on Shmap
          </Text>

          <Button size="xl" className="self-stretch" onPress={handleCopyLink}>
            <Text className="text-2xl">Copy link</Text>
          </Button>
        </View>
      </View>
    </Modal>
  );
}
