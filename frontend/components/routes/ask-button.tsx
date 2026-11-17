import { Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { MaterialIcons } from "@/lib/icons";
import { cn } from "@/lib/utils";

export interface AskButtonProps {
  onPress: () => void;
  className?: string;
}

export function AskButton({ onPress, className }: AskButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      className={cn(
        "h-11 flex-row items-center justify-center gap-2 rounded-xl bg-primary px-4 active:opacity-80",
        className,
      )}
    >
      <MaterialIcons
        name="auto-awesome"
        size={18}
        className="text-primary-foreground"
      />
      <Text className="text-sm font-medium leading-4 text-primary-foreground">
        Ask AI for places
      </Text>
    </Pressable>
  );
}
