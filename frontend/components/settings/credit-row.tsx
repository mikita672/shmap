import { Pressable, View } from "react-native";
import {
  openBrowserAsync,
  WebBrowserPresentationStyle,
} from "expo-web-browser";
import { Text } from "@/components/ui/text";
import { MaterialIcons } from "@/lib/icons";
import type { MapCredit } from "@/lib/map-credits";

export interface CreditRowProps {
  credit: MapCredit;
}

export function CreditRow({ credit }: CreditRowProps) {
  const handlePress = () => {
    openBrowserAsync(credit.url, {
      presentationStyle: WebBrowserPresentationStyle.AUTOMATIC,
    }).catch(() => {});
  };

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="link"
      accessibilityHint="Opens the license page"
      className="min-h-16 flex-row items-center gap-3 rounded-[32px] bg-action py-3 pl-6 pr-5 active:bg-action/80"
    >
      <View className="flex-1">
        <Text className="text-base text-action-foreground">{credit.name}</Text>
        <Text className="text-[13px] leading-[18px] text-secondary">
          {credit.usage} · {credit.license}
        </Text>
      </View>
      <MaterialIcons
        name="open-in-new"
        size={24}
        className="text-action-foreground"
      />
    </Pressable>
  );
}
