import { useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { SearchResultsList } from "@/components/friends/search-results-list";
import { SuggestionsList } from "@/components/friends/suggestions-list";
import { ProfileQrModal } from "@/components/profile/profile-qr-modal";
import { Button } from "@/components/ui/button";
import { QrCodeButton } from "@/components/ui/qr-code-button";
import { ScreenHeader } from "@/components/ui/screen-header";
import { SearchField } from "@/components/ui/search-field";
import { Text } from "@/components/ui/text";
import { useProfile } from "@/hooks/useProfile";
import { hasSearchText } from "@/lib/friend-search";

export default function AddFriendsScreen() {
  const { data: profile } = useProfile();
  const [query, setQuery] = useState("");
  const [qrModalVisible, setQrModalVisible] = useState(false);

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Add friends" />

      <SearchField
        className="mx-6 mt-3"
        placeholder="Search by name or @username"
        maxLength={100}
        value={query}
        onChangeText={setQuery}
      />

      {hasSearchText(query) ? (
        <SearchResultsList query={query} />
      ) : (
        <SuggestionsList />
      )}

      <View className="flex-row gap-2 px-6 pb-4">
        <Button
          variant="secondary"
          size="xl"
          className="flex-1"
          onPress={() => router.push("/scan")}
        >
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
