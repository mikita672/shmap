import { Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { MaterialIcons } from "@/lib/icons";
import { MAX_ROUTE_STOPS } from "@/lib/route-format";
import { cn } from "@/lib/utils";

export interface OpenInMapsButtonProps {
  stopCount: number;
  onPress?: () => void;
  className?: string;
}

export function OpenInMapsButton({
  stopCount,
  onPress,
  className,
}: OpenInMapsButtonProps) {
  const extraStops = stopCount - MAX_ROUTE_STOPS;
  const isTooLong = extraStops > 0;
  const isDisabled = isTooLong || !onPress;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      className={cn(
        "h-11 flex-row items-center justify-center gap-2 rounded-xl border-[1.5px] border-primary px-4 active:opacity-70",
        isDisabled && "opacity-50",
        className,
      )}
    >
      {!isTooLong && (
        <MaterialIcons
          name="directions"
          size={20}
          className="text-primary-foreground dark:text-primary"
        />
      )}
      <Text
        numberOfLines={1}
        className="shrink text-sm font-medium leading-4 text-primary-foreground dark:text-primary"
      >
        {isTooLong
          ? `Map apps take up to ${MAX_ROUTE_STOPS} stops · remove ${extraStops}`
          : "Open in maps"}
      </Text>
    </Pressable>
  );
}
