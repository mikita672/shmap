import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackButton } from "@/components/ui/back-button";
import { Text } from "@/components/ui/text";

export interface TitleHeaderProps {
  title: string;
  onBack?: () => void;
}

export function TitleHeader({ title, onBack }: TitleHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="h-[52px] flex-row items-center gap-1 pl-2 pr-6"
      style={{ marginTop: Math.max(insets.top + 8, 48) }}
    >
      <BackButton className="relative" iconSize={40} onPress={onBack} />
      <Text
        role="heading"
        numberOfLines={1}
        className="flex-1 text-2xl leading-8 tracking-[0.5px] text-heading"
      >
        {title}
      </Text>
    </View>
  );
}
