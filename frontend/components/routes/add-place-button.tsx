import { Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { MaterialIcons } from "@/lib/icons";
import { MAX_ROUTE_STOPS } from "@/lib/route-format";
import { cn } from "@/lib/utils";

export interface AddPlaceButtonProps {
  label: string;
  isFull?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  className?: string;
}

export function AddPlaceButton({
  label,
  isFull = false,
  disabled = false,
  onPress,
  className,
}: AddPlaceButtonProps) {
  const isDisabled = disabled || isFull || !onPress;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      className={cn(
        "h-11 flex-row items-center justify-center gap-2 rounded-xl bg-primary px-4 active:opacity-80",
        isDisabled && "opacity-50",
        className,
      )}
    >
      {!isFull && (
        <MaterialIcons
          name="add"
          size={20}
          className="text-primary-foreground"
        />
      )}
      <Text
        numberOfLines={1}
        className="shrink text-sm font-medium leading-4 text-primary-foreground"
      >
        {isFull ? `Route is full · ${MAX_ROUTE_STOPS} stops` : label}
      </Text>
    </Pressable>
  );
}
