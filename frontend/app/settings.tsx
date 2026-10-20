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
import {
  type PrivacySettings,
  useUpdatePrivacy,
} from "@/hooks/useProfileMutations";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { signOut } = useAuth();
  const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { data: profile } = useProfile();
  const privacy = useUpdatePrivacy();

  const pending = privacy.isPending ? privacy.variables : undefined;
  const privateAccount =
    pending?.privateAccount ?? profile?.privateAccount ?? false;
  const friendsListHidden =
    pending?.friendsListHidden ?? profile?.friendsListHidden ?? false;

  const updatePrivacy = (settings: PrivacySettings) => {
    if (!privacy.isPending) privacy.mutate(settings);
  };

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
              value={privateAccount}
              onValueChange={(value) =>
                updatePrivacy({ privateAccount: value })
              }
              disabled={!profile}
            />
            <SettingsRow
              variant="switch"
              icon="visibility-off"
              label="Hide friends list"
              subtitle="Only you can see your friends"
              value={friendsListHidden}
              onValueChange={(value) =>
                updatePrivacy({ friendsListHidden: value })
              }
              disabled={!profile}
            />
            <SettingsRow
              icon="block"
              label="Blocked users"
              onPress={() => router.push("/blocked-users")}
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
