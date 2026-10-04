import * as React from "react";
import { Pressable, View } from "react-native";
import { Input } from "@/components/ui/input";
import { MaterialIcons } from "@/lib/icons";
import { cn } from "@/lib/utils";

type PasswordInputProps = Omit<
  React.ComponentProps<typeof Input>,
  "secureTextEntry"
> & {
  containerClassName?: string;
};

function PasswordInput({
  className,
  containerClassName,
  ...props
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = React.useState(false);

  return (
    <View className={cn("relative w-full justify-center", containerClassName)}>
      <Input
        secureTextEntry={!isVisible}
        autoCapitalize="none"
        autoCorrect={false}
        className={cn("h-14 rounded-full pl-7 pr-14 sm:h-14", className)}
        {...props}
      />
      <Pressable
        onPress={() => setIsVisible((visible) => !visible)}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={isVisible ? "Hide password" : "Show password"}
        className="absolute right-4 active:opacity-60"
      >
        <MaterialIcons
          name={isVisible ? "visibility-off" : "visibility"}
          size={24}
          className="text-on-surface-muted"
        />
      </Pressable>
    </View>
  );
}

export { PasswordInput };
export type { PasswordInputProps };
