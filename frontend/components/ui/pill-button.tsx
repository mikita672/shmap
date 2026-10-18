import { Pressable, type PressableProps } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

const pillButtonVariants = cva(
  "h-9 items-center justify-center rounded-full px-4",
  {
    variants: {
      variant: {
        filled: "bg-action-chip active:bg-action-chip/80",
        tonal: "bg-action-tonal active:bg-action-tonal/80",
      },
    },
    defaultVariants: {
      variant: "filled",
    },
  },
);

const pillButtonTextVariants = cva(
  "text-sm font-medium leading-5 tracking-[0.5px]",
  {
    variants: {
      variant: {
        filled: "text-action-chip-foreground",
        tonal: "text-action-tonal-foreground",
      },
    },
    defaultVariants: {
      variant: "filled",
    },
  },
);

export interface PillButtonProps
  extends
    Omit<PressableProps, "children">,
    VariantProps<typeof pillButtonVariants> {
  label: string;
  className?: string;
}

export function PillButton({
  label,
  variant,
  className,
  disabled,
  ...props
}: PillButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      hitSlop={{ top: 6, bottom: 6 }}
      disabled={disabled}
      className={cn(
        pillButtonVariants({ variant }),
        disabled && "opacity-50",
        className,
      )}
      {...props}
    >
      <Text className={pillButtonTextVariants({ variant })}>{label}</Text>
    </Pressable>
  );
}
