import { useState } from "react";
import { View } from "react-native";
import { ProfileQrModal } from "@/components/profile/profile-qr-modal";
import { Button } from "@/components/ui/button";
import { QrCodeButton } from "@/components/ui/qr-code-button";
import { ScreenHeader } from "@/components/ui/screen-header";
import { Text } from "@/components/ui/text";
import { useProfile } from "@/hooks/useProfile";

export default function AddFriendsScreen() {
  const { data: profile } = useProfile();
  const [qrModalVisible, setQrModalVisible] = useState(false);

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Add friends" />

      <View className="flex-1" />

      <View className="flex-row gap-2 px-6 pb-4">
        <Button variant="secondary" size="xl" className="flex-1" disabled>
          <Text>Scan QR code</Text>
        </Button>
        <QrCodeButton
          accessibilityLabel="Show my QR code"
          disabled={!profile}
          onPress={() => setQrModalVisible(true)}
        />
      </View>

      {profile && (
        <ProfileQrModal
          visible={qrModalVisible}
          onClose={() => setQrModalVisible(false)}
          profile={profile}
        />
      )}
    </View>
  );
}
