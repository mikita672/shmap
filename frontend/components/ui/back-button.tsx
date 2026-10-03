import React from "react";
import { Pressable, type StyleProp, type ViewStyle } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@/lib/icons";
import { cn } from "@/lib/utils";

export interface BackButtonProps extends Omit<
  React.ComponentPropsWithoutRef<typeof Pressable>,
  "style"
> {
  onPress?: () => void;
  iconSize?: number;
  iconClassName?: string;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

export function BackButton({
  onPress,
  iconSize = 52,
  iconClassName = "text-secondary",
  className = "absolute top-16 left-6",
  style,
  ...props
}: BackButtonProps) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.back();
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel="Go back"
      className={cn("active:opacity-50 z-10", className)}
      style={style}
      {...props}
    >
      <MaterialIcons
        name="keyboard-arrow-left"
        size={iconSize}
        className={iconClassName}
      />
    </Pressable>
  );
}
