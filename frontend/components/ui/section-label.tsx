import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

export interface SectionLabelAction {
  label: string;
  onPress: () => void;
}

export interface SectionLabelProps {
  title: string;
  action?: SectionLabelAction;
  className?: string;
}

export function SectionLabel({ title, action, className }: SectionLabelProps) {
  return (
    <View
      className={cn("flex-row items-center justify-between px-5", className)}
    >
      <Text
        role="heading"
        className="text-sm leading-5 tracking-[0.5px] text-secondary"
      >
        {title}
      </Text>
      {action && (
        <Pressable
          onPress={action.onPress}
          accessibilityRole="button"
          hitSlop={12}
          className="active:opacity-60"
        >
          <Text className="text-sm font-medium leading-5 tracking-[0.5px] text-action-foreground">
            {action.label}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
