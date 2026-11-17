import { ActivityIndicator, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { MaterialIcons } from "@/lib/icons";
import { cn } from "@/lib/utils";

export interface AskButtonProps {
  onPress: () => void;
  variant?: "ask" | "pick";
  isAsking?: boolean;
  className?: string;
}

export function AskButton({
  onPress,
  variant = "ask",
  isAsking = false,
  className,
}: AskButtonProps) {
  const label = isAsking
    ? "Finding places…"
    : variant === "pick"
      ? "Pick interests"
      : "Ask AI for places";

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
          name={variant === "pick" ? "tune" : "auto-awesome"}
          size={18}
          className="text-primary-foreground"
        />
      )}
      <Text className="text-sm font-medium leading-4 text-primary-foreground">
        {label}
      </Text>
    </Pressable>
  );
}
