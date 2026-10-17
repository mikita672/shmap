import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackButton } from "@/components/ui/back-button";
import { Text } from "@/components/ui/text";

export interface ScreenHeaderProps {
  title: string;
}

export function ScreenHeader({ title }: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="h-[52px] items-center justify-center"
      style={{ marginTop: Math.max(insets.top + 8, 48) }}
    >
      <Text
        role="heading"
        className="text-heading text-2xl leading-8 tracking-[0.5px]"
      >
        {title}
      </Text>
      <BackButton className="absolute left-6 top-0" />
    </View>
  );
}
