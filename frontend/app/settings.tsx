import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { BackButton } from "@/components/ui/back-button";
import { Text } from "@/components/ui/text";
import { SettingsRow } from "@/components/settings/settings-row";
import { SettingsSection } from "@/components/settings/settings-section";
import { ThemeSwitch } from "@/components/theme-switch";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const headerTop = Math.max(insets.top + 8, 48);

  return (
    <View className="flex-1 bg-background">
      <View
        className="h-[52px] items-center justify-center"
        style={{ marginTop: headerTop }}
      >
        <Text
          role="heading"
          className="text-heading text-2xl leading-8 tracking-[0.5px]"
        >
          Settings
        </Text>
        <BackButton className="absolute left-6 top-0" />
      </View>

      <View className="gap-6 px-6 pt-3">
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
    </View>
  );
}
