import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { MaterialIcons } from "@/lib/icons";

export interface SelectionHeaderProps {
  count: number;
  onClose: () => void;
}

export function SelectionHeader({ count, onClose }: SelectionHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="h-[52px] flex-row items-center gap-1 pl-2 pr-6"
      style={{ marginTop: Math.max(insets.top + 8, 48) }}
    >
      <Pressable
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Cancel selection"
        className="h-10 w-10 items-center justify-center active:opacity-50"
      >
        <MaterialIcons name="close" size={32} className="text-secondary" />
      </Pressable>
      <Text
        role="heading"
        numberOfLines={1}
        className="flex-1 text-2xl leading-8 tracking-[0.5px] text-heading"
      >
        {count} selected
      </Text>
    </View>
  );
}
