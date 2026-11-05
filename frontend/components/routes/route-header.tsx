import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Text } from "@/components/ui/text";
import { MaterialIcons } from "@/lib/icons";
import { cn } from "@/lib/utils";

const BUTTON_CLASS =
  "h-14 w-14 items-center justify-center rounded-full bg-searchbar shadow-sm shadow-black/10 elevation-3 active:opacity-80";

export interface RouteHeaderProps {
  name: string;
  chatTitle?: string;
  onMore?: () => void;
}

export function RouteHeader({ name, chatTitle, onMore }: RouteHeaderProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View
      pointerEvents="box-none"
      className="absolute left-0 right-0 flex-row items-center gap-2.5 px-3"
      style={{ top: Math.max(insets.top, 8) + 8 }}
    >
      <Pressable
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        className={BUTTON_CLASS}
      >
        <MaterialIcons
          name="arrow-back"
          size={28}
          className="text-card-title"
        />
      </Pressable>

      <View className="h-14 min-w-0 flex-1 justify-center rounded-full bg-searchbar pl-6 pr-5 shadow-sm shadow-black/10 elevation-3">
        <Text
          role="heading"
          numberOfLines={1}
          className="text-lg leading-6 text-card-title"
        >
          {name}
        </Text>
        {chatTitle ? (
          <Text
            numberOfLines={1}
            className="text-[13px] leading-4 text-secondary"
          >
            {chatTitle}
          </Text>
        ) : null}
      </View>

      <Pressable
        onPress={onMore}
        disabled={!onMore}
        accessibilityRole="button"
        accessibilityLabel="Route options"
        className={cn(BUTTON_CLASS, !onMore && "opacity-50")}
      >
        <MaterialIcons name="more-vert" size={24} className="text-card-title" />
      </Pressable>
    </View>
  );
}
