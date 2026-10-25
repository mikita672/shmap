import { Pressable, type PressableProps } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { Badge } from "@/components/ui/badge";
import { MaterialIcons, type MaterialIconName } from "@/lib/icons";
import { cn } from "@/lib/utils";

const roundButtonVariants = cva("items-center justify-center rounded-full", {
  variants: {
    variant: {
      filled: "bg-action-accent active:bg-action-accent/80",
      tonal: "bg-action-tonal active:bg-action-tonal/80",
      surface: "bg-action active:bg-action/80",
    },
    size: {
      default: "h-10 w-10",
      md: "h-12 w-12",
      lg: "h-14 w-14",
    },
  },
  defaultVariants: {
    variant: "surface",
    size: "default",
  },
});

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
  badge?: number;
  className?: string;
  iconClassName?: string;
}

export function RoundButton({
  icon,
  variant,
  size,
  badge = 0,
  className,
  iconClassName,
  disabled,
  ...props
}: RoundButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      hitSlop={4}
      disabled={disabled}
      className={cn(
        roundButtonVariants({ variant, size }),
        disabled && "opacity-50",
        className,
      )}
      {...props}
    >
      <MaterialIcons
        name={icon}
        size={24}
        className={cn(roundButtonIconVariants({ variant }), iconClassName)}
      />
      <Badge count={badge} className="absolute -right-0.5 -top-0.5" />
    </Pressable>
  );
}
