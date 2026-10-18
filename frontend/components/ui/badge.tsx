import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

const MAX_COUNT = 99;

export interface BadgeProps {
  count: number;
  className?: string;
}

export function Badge({ count, className }: BadgeProps) {
  if (count <= 0) return null;

  return (
    <View
      className={cn(
        "h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1.5",
        className,
      )}
    >
      <Text className="text-xs font-medium leading-4 tracking-[0.5px] text-brand-foreground">
        {count > MAX_COUNT ? `${MAX_COUNT}+` : count}
      </Text>
    </View>
  );
}
