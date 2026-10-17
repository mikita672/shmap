import { useState } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "sonner-native";
import { FriendRow } from "@/components/friends/friend-row";
import { SettingsSection } from "@/components/settings/settings-section";
import { ThemeSwitch } from "@/components/theme-switch";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PillButton } from "@/components/ui/pill-button";
import { RoundButton } from "@/components/ui/round-button";
import { SearchField } from "@/components/ui/search-field";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { SheetItem } from "@/components/ui/sheet-item";
import { Text } from "@/components/ui/text";

export function ComponentsPreview() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"friends" | "requests">("friends");

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

      <SettingsSection title="Search Field">
        <SearchField
          value={query}
          onChangeText={setQuery}
          placeholder="Search friends"
        />
      </SettingsSection>

      <SettingsSection title="Avatar (on background, on surface)">
        <View className="flex-row items-center gap-4 px-5">
          <Avatar />
          <View className="rounded-full bg-action p-2">
            <Avatar tone="surface" />
          </View>
          <Avatar size={96} />
        </View>
      </SettingsSection>

      <SettingsSection title="Friend Row (actions)">
        <FriendRow
          name="Anna Kowalska"
          subtitle="@anna.k"
          variant="actions"
          onPress={() => toast("Open Anna's profile")}
          onMessage={() => toast("Message Anna")}
          onMore={() => toast("More for Anna")}
        />
        <FriendRow
          name="Konstantynopolitańczykiewiczówna Wiśniewska"
          subtitle="@a.very.long.username.that.does.not.fit"
          variant="actions"
          onMessage={() => toast("Message")}
          onMore={() => toast("More")}
          disabled
        />
      </SettingsSection>

      <SettingsSection title="Friend Row (request, sent)">
        <FriendRow
          name="Ola Wiśniewska"
          subtitle="3 mutual friends"
          variant="request"
          onAccept={() => toast("Accept Ola")}
          onDecline={() => toast("Decline Ola")}
        />
        <FriendRow
          name="Piotr Kamiński"
          subtitle="1 mutual friend"
          variant="request"
          onAccept={() => toast("Accept Piotr")}
          onDecline={() => toast("Decline Piotr")}
          disabled
        />
        <FriendRow
          name="Zofia Dąbrowska"
          subtitle="@zofia.d"
          variant="sent"
          onCancel={() => toast("Cancel request to Zofia")}
        />
      </SettingsSection>

      <SettingsSection title="Friend Row (suggestion)">
        <FriendRow
          name="Marta Kozłowska"
          subtitle="4 mutual friends"
          variant="suggestion"
          onAdd={() => toast("Add Marta")}
          onDismiss={() => toast("Dismiss Marta")}
        />
      </SettingsSection>

      <SettingsSection title="Sheet Item (default, danger)">
        <View className="rounded-[32px] bg-card py-2">
          <SheetItem
            label="Add to group"
            onPress={() => toast("Add to group")}
          />
          <SheetItem label="Mute routes" onPress={() => toast("Mute")} />
          <SheetItem
            label="Remove friend"
            tone="danger"
            onPress={() => toast("Remove")}
          />
          <SheetItem
            label="Block"
            tone="danger"
            onPress={() => toast("Block")}
          />
        </View>
      </SettingsSection>

      <SettingsSection title="Segmented Control">
        <SegmentedControl
          segments={[
            { value: "friends", label: "Friends" },
            { value: "requests", label: "Requests", badge: 2 },
          ]}
          value={tab}
          onValueChange={setTab}
        />
      </SettingsSection>
    </ScrollView>
  );
}
