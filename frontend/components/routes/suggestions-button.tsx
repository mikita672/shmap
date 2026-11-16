import { Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { MaterialIcons } from "@/lib/icons";
import { cn } from "@/lib/utils";

export interface SuggestionsButtonProps {
  onPress: () => void;
  className?: string;
}

export function SuggestionsButton({
  onPress,
  className,
}: SuggestionsButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      className={cn(
        "h-11 flex-row items-center justify-center gap-2 rounded-xl bg-action px-4 active:opacity-80 dark:bg-on-surface/15",
        className,
      )}
    >
      <MaterialIcons
        name="auto-awesome"
        size={18}
        className="text-action-foreground dark:text-on-surface"
      />
      <Text
        numberOfLines={1}
        className="shrink text-sm font-medium leading-4 text-action-foreground dark:text-on-surface"
      >
        Suggestions
      </Text>
    </Pressable>
  );
}
