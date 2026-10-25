import { Pressable, View } from "react-native";
import { Avatar } from "@/components/ui/avatar";
import { Text } from "@/components/ui/text";
import { MaterialIcons } from "@/lib/icons";
import { cn } from "@/lib/utils";

export interface PickerRowProps {
  name: string;
  subtitle: string;
  avatarUrl?: string | null;
  selected?: "off" | "on" | "member";
  showCheck?: boolean;
  onPress?: () => void;
}

export function PickerRow({
  name,
  subtitle,
  avatarUrl,
  selected = "off",
  showCheck = true,
  onPress,
}: PickerRowProps) {
  const isMember = selected === "member";
  const isChecked = selected === "on" || isMember;

  return (
    <Pressable
      onPress={onPress}
      disabled={isMember || !onPress}
      accessibilityRole={
        showCheck ? "checkbox" : onPress ? "button" : undefined
      }
      accessibilityState={{
        checked: isChecked,
        disabled: isMember,
      }}
      className={cn(
        "h-16 flex-row items-center gap-3 rounded-full bg-action pl-2 pr-5 active:opacity-80",
        isMember && "opacity-55 active:opacity-55",
      )}
    >
      <Avatar uri={avatarUrl} size={48} tone="surface" />

      <View className="flex-1">
        <Text
          numberOfLines={1}
          className="text-base leading-6 text-action-foreground"
        >
          {name}
        </Text>
        <Text numberOfLines={1} className="text-sm leading-5 text-secondary">
          {subtitle}
        </Text>
      </View>

      {showCheck && (
        <View
          className={cn(
            "h-6 w-6 items-center justify-center rounded-full",
            selected === "off"
              ? "border-2 border-picker-ring"
              : "bg-action-foreground",
          )}
        >
          {isChecked && (
            <MaterialIcons name="check" size={16} className="text-action" />
          )}
        </View>
      )}
    </Pressable>
  );
}
