import { useState } from "react";
import { View } from "react-native";
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

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { signOut } = useAuth();
  const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

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

      <View className="flex-1 gap-6 px-6 pt-3">
        <SettingsSection title="Appearance">
          <ThemeSwitch />
        </SettingsSection>

        <SettingsSection title="Account">
          <SettingsRow
            icon="lock"
            label="Change password"
            onPress={() => router.push("/change-password")}
          />
        </SettingsSection>
      </View>

      <View className="px-6" style={{ paddingBottom: insets.bottom + 24 }}>
        <LogoutButton onPress={() => setLogoutDialogVisible(true)} />
      </View>

      <LogoutDialog
        visible={logoutDialogVisible}
        isPending={isSigningOut}
        onConfirm={handleLogout}
        onCancel={() => setLogoutDialogVisible(false)}
      />
    </View>
  );
}
