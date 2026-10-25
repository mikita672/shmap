import { Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { MaterialIcons } from "@/lib/icons";
import { cn } from "@/lib/utils";

export interface MemberChipProps {
  name: string;
  onRemove?: () => void;
  className?: string;
}

export function MemberChip({ name, onRemove, className }: MemberChipProps) {
  return (
    <Pressable
      onPress={onRemove}
      disabled={!onRemove}
      accessibilityRole="button"
      accessibilityLabel={`Remove ${name}`}
      className={cn(
        "h-8 flex-row items-center gap-1 rounded-full bg-action-chip pl-3 pr-2 active:opacity-80",
        className,
      )}
    >
      <Text
        numberOfLines={1}
        className="max-w-[140px] text-sm font-medium leading-5 text-action-chip-foreground"
      >
        {name}
      </Text>
      <MaterialIcons
        name="close"
        size={16}
        className="text-action-chip-foreground"
      />
    </Pressable>
  );
}
