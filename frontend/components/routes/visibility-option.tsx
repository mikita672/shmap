import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

export interface VisibilityOptionProps {
  title: string;
  description: string;
  selected: boolean;
  disabled?: boolean;
  onPress: () => void;
}

export function VisibilityOption({
  title,
  description,
  selected,
  disabled,
  onPress,
}: VisibilityOptionProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected, disabled }}
      className="h-16 flex-row items-center gap-3 rounded-full bg-action px-5 active:opacity-80"
    >
      <View
        className={cn(
          "h-6 w-6 items-center justify-center rounded-full border-2",
          selected ? "border-action-foreground" : "border-picker-ring",
        )}
      >
        {selected && (
          <View className="h-3 w-3 rounded-full bg-action-foreground" />
        )}
      </View>

      <View className="flex-1">
        <Text
          numberOfLines={1}
          className="text-base leading-6 text-action-foreground"
        >
          {title}
        </Text>
        <Text numberOfLines={1} className="text-sm leading-5 text-secondary">
          {description}
        </Text>
      </View>
    </Pressable>
  );
}
