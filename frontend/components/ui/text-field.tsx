import * as React from "react";
import { View } from "react-native";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

type TextFieldProps = React.ComponentProps<typeof Input> & {
  label: string;
  error?: string;
  showCount?: boolean;
  containerClassName?: string;
};

function TextField({
  label,
  error,
  showCount = false,
  multiline,
  maxLength,
  value,
  className,
  containerClassName,
  ...props
}: TextFieldProps) {
  const hasCounter = showCount && maxLength !== undefined;

  return (
    <View className={cn("gap-1.5", containerClassName)}>
      <Text className="text-secondary text-sm leading-5 tracking-[0.5px] pl-7">
        {label}
      </Text>

      <Input
        accessibilityLabel={label}
        aria-invalid={Boolean(error)}
        multiline={multiline}
        maxLength={maxLength}
        value={value}
        textAlignVertical={multiline ? "top" : "center"}
        className={cn(
          multiline
            ? "h-28 sm:h-28 rounded-3xl px-6 py-4"
            : "h-14 sm:h-14 rounded-full px-7 py-0",
          "tracking-[0.5px]",
          error && "border-destructive border-2",
          className,
        )}
        {...props}
      />

      {(error || hasCounter) && (
        <View className="flex-row justify-between gap-3 px-7">
          <Text
            className="flex-1 text-destructive text-xs"
            accessibilityLiveRegion="polite"
          >
            {error ?? ""}
          </Text>
          {hasCounter && (
            <Text className="text-secondary text-xs">
              {value?.length ?? 0}/{maxLength}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

export { TextField };
export type { TextFieldProps };
