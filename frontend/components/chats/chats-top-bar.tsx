import { Pressable, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { MaterialIcons, type MaterialIconName } from "@/lib/icons";
import { cn } from "@/lib/utils";

export interface ChatsTopBarProps {
  searchQuery: string | null;
  onSearchQueryChange: (query: string | null) => void;
  onNewGroup?: () => void;
}

export function ChatsTopBar({
  searchQuery,
  onSearchQueryChange,
  onNewGroup,
}: ChatsTopBarProps) {
  const insets = useSafeAreaInsets();
  const isSearching = searchQuery !== null;

  return (
    <View className="bg-app-bar" style={{ paddingTop: insets.top }}>
      {isSearching ? (
        <View className="h-16 flex-row items-center pl-1 pr-5">
          <TopBarIconButton
            icon="arrow-back"
            accessibilityLabel="Close search"
            onPress={() => onSearchQueryChange(null)}
          />
          <TextInput
            value={searchQuery}
            onChangeText={onSearchQueryChange}
            autoFocus
            role="searchbox"
            enterKeyHint="search"
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Search chats"
            className="h-full flex-1 py-0 text-lg text-heading placeholder:text-heading/60"
          />
        </View>
      ) : (
        <View className="h-16 flex-row items-center pl-5 pr-2">
          <Text
            role="heading"
            className="flex-1 text-[22px] leading-7 text-heading"
          >
            Chats
          </Text>
          <TopBarIconButton
            icon="search"
            accessibilityLabel="Search chats"
            onPress={() => onSearchQueryChange("")}
          />
          <TopBarIconButton
            icon="group-add"
            accessibilityLabel="New group"
            onPress={onNewGroup}
          />
        </View>
      )}
    </View>
  );
}

interface TopBarIconButtonProps {
  icon: MaterialIconName;
  accessibilityLabel: string;
  onPress?: () => void;
}

function TopBarIconButton({
  icon,
  accessibilityLabel,
  onPress,
}: TopBarIconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      className={cn(
        "h-12 w-12 items-center justify-center rounded-full active:opacity-60",
        !onPress && "opacity-50",
      )}
    >
      <MaterialIcons name={icon} size={24} className="text-heading" />
    </Pressable>
  );
}
