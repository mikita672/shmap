import { useState } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { toast } from "sonner-native";
import { ScreenHeader } from "@/components/ui/screen-header";
import { LogoutButton } from "@/components/settings/logout-button";
import { LogoutDialog } from "@/components/settings/logout-dialog";
import { SettingsRow } from "@/components/settings/settings-row";
import { SettingsSection } from "@/components/settings/settings-section";
import { ThemeSwitch } from "@/components/theme-switch";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { signOut } = useAuth();
  const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { data: profile } = useProfile();

  const handleLogout = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
    } catch {
      toast.error("Couldn't log out. Please try again.");
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Settings" />

      <ScrollView
        className="flex-1"
        contentContainerClassName="grow justify-between gap-6 px-6 pt-3"
      >
        <View className="gap-6">
          <SettingsSection title="Appearance">
            <ThemeSwitch />
          </SettingsSection>

          <SettingsSection title="Privacy">
            <SettingsRow
              variant="switch"
              icon="lock-person"
              label="Private account"
              subtitle="Only friends see your full profile"
              value={profile?.privateAccount ?? false}
              onValueChange={() => {}}
              disabled={!profile}
            />
            <SettingsRow
              variant="switch"
              icon="visibility-off"
              label="Hide friends list"
              subtitle="Only you can see your friends"
              value={profile?.friendsListHidden ?? false}
              onValueChange={() => {}}
              disabled={!profile}
            />
          </SettingsSection>

          <SettingsSection title="Account">
            <SettingsRow
              icon="lock"
              label="Change password"
              onPress={() => router.push("/change-password")}
            />
          </SettingsSection>
        </View>

        <View style={{ paddingBottom: insets.bottom + 24 }}>
          <LogoutButton onPress={() => setLogoutDialogVisible(true)} />
        </View>
      </ScrollView>

      <LogoutDialog
        visible={logoutDialogVisible}
        isPending={isSigningOut}
        onConfirm={handleLogout}
        onCancel={() => setLogoutDialogVisible(false)}
      />
    </View>
  );
}
