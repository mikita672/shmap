import { Pressable, type PressableProps } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { MaterialIcons, type MaterialIconName } from "@/lib/icons";
import { cn } from "@/lib/utils";

const roundButtonVariants = cva(
  "h-10 w-10 items-center justify-center rounded-full",
  {
    variants: {
      variant: {
        filled: "bg-action-accent active:bg-action-accent/80",
        tonal: "bg-action-tonal active:bg-action-tonal/80",
        surface: "bg-action active:bg-action/80",
      },
    },
    defaultVariants: {
      variant: "surface",
    },
  },
);

const roundButtonIconVariants = cva("", {
  variants: {
    variant: {
      filled: "text-action-accent-foreground",
      tonal: "text-action-tonal-foreground",
      surface: "text-action-foreground",
    },
  },
  defaultVariants: {
    variant: "surface",
  },
});

export interface RoundButtonProps
  extends
    Omit<PressableProps, "children">,
    VariantProps<typeof roundButtonVariants> {
  icon: MaterialIconName;
  accessibilityLabel: string;
  className?: string;
}

export function RoundButton({
  icon,
  variant,
  className,
  disabled,
  ...props
}: RoundButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      hitSlop={4}
      disabled={disabled}
      className={cn(
        roundButtonVariants({ variant }),
        disabled && "opacity-50",
        className,
      )}
      {...props}
    >
      <MaterialIcons
        name={icon}
        size={24}
        className={roundButtonIconVariants({ variant })}
      />
    </Pressable>
  );
}
