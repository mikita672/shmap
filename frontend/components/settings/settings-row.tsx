import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";
import { MaterialIcons } from "@/lib/icons";

export interface SettingsRowProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  onPress?: () => void;
}

export function SettingsRow({ icon, label, onPress }: SettingsRowProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      className="h-16 flex-row items-center gap-3 rounded-full bg-action pl-2 pr-4 active:bg-action/80"
    >
      <View className="h-12 w-12 items-center justify-center rounded-full bg-action-chip">
        <MaterialIcons
          name={icon}
          size={24}
          className="text-action-chip-foreground"
        />
      </View>
      <Text className="flex-1 text-lg text-action-foreground">{label}</Text>
      <MaterialIcons
        name="chevron-right"
        size={24}
        className="text-action-foreground"
      />
    </Pressable>
  );
}
