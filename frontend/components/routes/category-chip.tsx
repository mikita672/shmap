import { Pressable } from "react-native";
import { cva } from "class-variance-authority";
import { Text } from "@/components/ui/text";
import { MaterialIcons } from "@/lib/icons";
import { PLACE_CATEGORY_INFO } from "@/lib/place-categories";
import type { PlaceCategory } from "@/lib/types/api";
import { cn } from "@/lib/utils";

type ChipVariant = "off" | "on" | "tonal";

const chipVariants = cva(
  "h-8 flex-row items-center gap-1.5 rounded-full pl-2.5 pr-3",
  {
    variants: {
      variant: {
        off: "border border-on-surface-muted/60",
        on: "bg-primary",
        tonal: "bg-on-surface/10",
      },
    },
  },
);

const contentVariants = cva("", {
  variants: {
    variant: {
      off: "text-on-surface",
      on: "text-primary-foreground",
      tonal: "text-on-surface",
    },
  },
});

export interface CategoryChipProps {
  category: PlaceCategory;
  variant: ChipVariant;
  count?: number;
  onPress?: () => void;
  className?: string;
}

export function CategoryChip({
  category,
  variant,
  count,
  onPress,
  className,
}: CategoryChipProps) {
  const { label, icon } = PLACE_CATEGORY_INFO[category];
  const content = contentVariants({ variant });

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? "button" : "text"}
      accessibilityState={onPress ? { selected: variant === "on" } : undefined}
      accessibilityLabel={count === undefined ? label : `${label}, ${count}`}
      className={cn(
        chipVariants({ variant }),
        onPress && "active:opacity-80",
        className,
      )}
    >
      <MaterialIcons name={icon} size={16} className={content} />
      <Text className={cn("text-[13px] font-medium leading-4", content)}>
        {label}
      </Text>
      {count !== undefined && (
        <Text
          className={cn("text-xs font-medium leading-4 opacity-70", content)}
        >
          {count}
        </Text>
      )}
    </Pressable>
  );
}
