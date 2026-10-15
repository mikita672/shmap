import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SettingsSection } from "@/components/settings/settings-section";
import { ThemeSwitch } from "@/components/theme-switch";
import { Button } from "@/components/ui/button";
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
    </ScrollView>
  );
}
