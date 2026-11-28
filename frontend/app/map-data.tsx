import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CreditRow } from "@/components/settings/credit-row";
import { SettingsSection } from "@/components/settings/settings-section";
import { ScreenHeader } from "@/components/ui/screen-header";
import { Text } from "@/components/ui/text";
import { MAP_CREDIT_GROUPS } from "@/lib/map-credits";
import { MAP_STYLE_NOTICES } from "@/lib/map-style/notices";

export default function MapDataScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Map data & licenses" />

      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-6 px-6 pt-3"
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      >
        <Text className="px-2 text-sm text-foreground">
          Shmap&apos;s maps are built from open data. Tap a row to read its
          license.
        </Text>

        {MAP_CREDIT_GROUPS.map((group) => (
          <SettingsSection key={group.title} title={group.title}>
            {group.credits.map((credit) => (
              <CreditRow key={credit.name} credit={credit} />
            ))}
          </SettingsSection>
        ))}

        <SettingsSection title="License notices">
          {MAP_STYLE_NOTICES.map((notice) => (
            <View
              key={notice.title}
              className="gap-2 rounded-3xl bg-action px-5 py-4"
            >
              <Text className="text-base text-action-foreground">
                {notice.title}
              </Text>
              {notice.paragraphs.map((paragraph) => (
                <Text
                  key={paragraph}
                  selectable
                  className="text-xs leading-5 text-secondary"
                >
                  {paragraph}
                </Text>
              ))}
            </View>
          ))}
        </SettingsSection>
      </ScrollView>
    </View>
  );
}
