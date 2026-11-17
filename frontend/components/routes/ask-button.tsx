import { ActivityIndicator, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { MaterialIcons } from "@/lib/icons";
import { cn } from "@/lib/utils";

export interface AskButtonProps {
  onPress: () => void;
  isAsking?: boolean;
  className?: string;
}

export function AskButton({
  onPress,
  isAsking = false,
  className,
}: AskButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={isAsking}
      accessibilityRole="button"
      accessibilityState={{ busy: isAsking }}
      className={cn(
        "h-11 flex-row items-center justify-center gap-2 rounded-xl bg-primary px-4 active:opacity-80",
        className,
      )}
    >
      {isAsking ? (
        <ActivityIndicator
          size="small"
          className="h-[18px] w-[18px] text-primary-foreground"
        />
      ) : (
        <MaterialIcons
          name="auto-awesome"
          size={18}
          className="text-primary-foreground"
        />
      )}
      <Text className="text-sm font-medium leading-4 text-primary-foreground">
        {isAsking ? "Finding places…" : "Ask AI for places"}
      </Text>
    </Pressable>
  );
}
