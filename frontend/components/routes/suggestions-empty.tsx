import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { MaterialIcons } from "@/lib/icons";

export interface SuggestionsEmptyProps {
  title: string;
  description: string;
}

export function SuggestionsEmpty({
  title,
  description,
}: SuggestionsEmptyProps) {
  return (
    <View className="items-center gap-1.5 py-3">
      <MaterialIcons
        name="auto-awesome"
        size={28}
        className="text-brand dark:text-on-surface"
      />
      <Text className="text-center text-base font-medium leading-5 text-on-surface">
        {title}
      </Text>
      <Text className="text-center text-sm leading-5 text-on-surface-muted">
        {description}
      </Text>
    </View>
  );
}
