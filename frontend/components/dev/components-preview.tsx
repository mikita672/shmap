import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SettingsSection } from "@/components/settings/settings-section";
import { ThemeSwitch } from "@/components/theme-switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PillButton } from "@/components/ui/pill-button";
import { RoundButton } from "@/components/ui/round-button";
import { Text } from "@/components/ui/text";

export function ComponentsPreview() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="gap-6 px-6 pb-12"
      contentContainerStyle={{ paddingTop: insets.top + 16 }}
    >
      <ThemeSwitch />

      <SettingsSection title="Secondary Button">
        <Button variant="secondary" size="xl">
          <Text>Scan QR code</Text>
        </Button>
      </SettingsSection>

      <SettingsSection title="Round Button">
        <View className="flex-row gap-4 px-5">
          <RoundButton icon="add" variant="filled" accessibilityLabel="Add" />
          <RoundButton icon="add" variant="tonal" accessibilityLabel="Add" />
          <RoundButton icon="add" variant="surface" accessibilityLabel="Add" />
          <RoundButton
            icon="add"
            variant="filled"
            accessibilityLabel="Add"
            disabled
          />
        </View>
      </SettingsSection>

      <SettingsSection title="Pill Button">
        <View className="flex-row gap-4 px-5">
          <PillButton label="Add" />
          <PillButton label="Cancel" variant="tonal" />
          <PillButton label="Add" disabled />
        </View>
      </SettingsSection>

      <SettingsSection title="Badge (2, 12, 120, 0)">
        <View className="flex-row items-center gap-4 px-5">
          <Badge count={2} />
          <Badge count={12} />
          <Badge count={120} />
          <Badge count={0} />
        </View>
      </SettingsSection>
    </ScrollView>
  );
}
