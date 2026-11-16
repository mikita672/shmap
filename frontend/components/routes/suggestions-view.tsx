import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Ionicons } from "@/lib/icons";

export interface SuggestionsViewProps {
  onClose: () => void;
}

export function SuggestionsView({ onClose }: SuggestionsViewProps) {
  return (
    <View className="gap-3">
      <View className="flex-row items-center gap-2">
        <Text className="flex-1 text-lg font-medium leading-6 text-on-surface">
          Suggestions
        </Text>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onPress={onClose}
          accessibilityLabel="Close suggestions"
        >
          <Ionicons name="close" size={18} className="text-on-surface-muted" />
        </Button>
      </View>
    </View>
  );
}
