import * as Haptics from "expo-haptics";
import { Platform, Pressable, View } from "react-native";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { MaterialIcons, type MaterialIconName } from "@/lib/icons";
import { cn } from "@/lib/utils";

const ROW_CLASS =
  "h-16 flex-row items-center gap-3 rounded-full bg-action pl-2 pr-4 active:bg-action/80";

type SettingsRowTrailingProps =
  | { variant?: "link"; onPress?: () => void }
  | {
      variant: "switch";
      value: boolean;
      onValueChange: (value: boolean) => void;
      disabled?: boolean;
    };

export type SettingsRowProps = SettingsRowTrailingProps & {
  icon: MaterialIconName;
  label: string;
  subtitle?: string;
};

export function SettingsRow({
  icon,
  label,
  subtitle,
  ...trailing
}: SettingsRowProps) {
  const content = (
    <SettingsRowContent icon={icon} label={label} subtitle={subtitle} />
  );

  if (trailing.variant === "switch") {
    const { value, onValueChange, disabled = false } = trailing;

    const handlePress = () => {
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      }
      onValueChange(!value);
    };

    return (
      <Pressable
        onPress={handlePress}
        disabled={disabled}
        accessibilityRole="switch"
        accessibilityState={{ checked: value, disabled }}
        className={cn(ROW_CLASS, disabled && "opacity-50")}
      >
        {content}
        <View
          className="pointer-events-none"
          importantForAccessibility="no-hide-descendants"
          accessibilityElementsHidden
        >
          <Switch value={value} />
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={trailing.onPress}
      accessibilityRole="button"
      className={ROW_CLASS}
    >
      {content}
      <MaterialIcons
        name="chevron-right"
        size={24}
        className="text-action-foreground"
      />
    </Pressable>
  );
}

interface SettingsRowContentProps {
  icon: MaterialIconName;
  label: string;
  subtitle?: string;
}

function SettingsRowContent({
  icon,
  label,
  subtitle,
}: SettingsRowContentProps) {
  return (
    <>
      <View className="h-12 w-12 items-center justify-center rounded-full bg-action-chip">
        <MaterialIcons
          name={icon}
          size={24}
          className="text-action-chip-foreground"
        />
      </View>
      <View className="flex-1">
        <Text className="text-lg text-action-foreground">{label}</Text>
        {subtitle ? (
          <Text
            numberOfLines={1}
            className="text-sm leading-5 tracking-[0.5px] text-secondary"
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
    </>
  );
}
