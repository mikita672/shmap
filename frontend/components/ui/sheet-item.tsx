import { Pressable, type PressableProps } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

const sheetItemTextVariants = cva("text-lg leading-6 tracking-[0.5px]", {
  variants: {
    tone: {
      default: "text-card-title",
      danger: "font-medium text-card-danger",
    },
  },
  defaultVariants: {
    tone: "default",
  },
});

export interface SheetItemProps
  extends
    Omit<PressableProps, "children">,
    VariantProps<typeof sheetItemTextVariants> {
  label: string;
  className?: string;
}

export function SheetItem({
  label,
  tone,
  className,
  disabled,
  ...props
}: SheetItemProps) {
  return (
    <Pressable
      accessibilityRole="menuitem"
      disabled={disabled}
      className={cn(
        "h-14 justify-center px-6 active:opacity-60",
        disabled && "opacity-50",
        className,
      )}
      {...props}
    >
      <Text className={sheetItemTextVariants({ tone })}>{label}</Text>
    </Pressable>
  );
}
