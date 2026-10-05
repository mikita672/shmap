import * as React from "react";
import { Pressable, View } from "react-native";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { MaterialIcons } from "@/lib/icons";
import { cn } from "@/lib/utils";

type PasswordInputProps = Omit<
  React.ComponentProps<typeof Input>,
  "secureTextEntry"
> & {
  error?: string;
  containerClassName?: string;
};

function PasswordInput({
  error,
  className,
  containerClassName,
  ...props
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = React.useState(false);

  return (
    <View className={cn("w-full gap-1.5", containerClassName)}>
      <View className="relative w-full justify-center">
        <Input
          secureTextEntry={!isVisible}
          autoCapitalize="none"
          autoCorrect={false}
          aria-invalid={Boolean(error)}
          className={cn(
            "h-14 rounded-full pl-7 pr-14 sm:h-14",
            error && "border-destructive border-2",
            className,
          )}
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

      {error ? (
        <Text
          className="px-7 text-destructive text-xs"
          accessibilityLiveRegion="polite"
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
}

export { PasswordInput };
export type { PasswordInputProps };
