import { View } from "react-native";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { toast } from "sonner-native";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Popup } from "@/components/ui/popup";
import { RoundButton } from "@/components/ui/round-button";
import { Text } from "@/components/ui/text";
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
    <Popup
      visible={visible}
      onClose={onClose}
      className="items-center gap-4 px-6 pt-8 pb-6"
    >
      <RoundButton
        icon="close"
        accessibilityLabel="Close"
        hitSlop={8}
        onPress={onClose}
        className="absolute right-4 top-4"
      />

      <Avatar uri={profile.avatarUrl} size={72} tone="surface" />

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
    </Popup>
  );
}
