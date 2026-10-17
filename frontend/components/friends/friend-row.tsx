import { Pressable, View } from "react-native";
import { Avatar } from "@/components/ui/avatar";
import { RoundButton } from "@/components/ui/round-button";
import { Text } from "@/components/ui/text";
import { MaterialIcons, type MaterialIconName } from "@/lib/icons";
import { cn } from "@/lib/utils";

type FriendRowTrailingProps = {
  variant: "actions";
  onMessage: () => void;
  onMore: () => void;
};

export type FriendRowProps = FriendRowTrailingProps & {
  name: string;
  subtitle: string;
  avatarUrl?: string | null;
  disabled?: boolean;
  onPress?: () => void;
};

export function FriendRow({
  name,
  subtitle,
  avatarUrl,
  disabled = false,
  onPress,
  ...trailing
}: FriendRowProps) {
  return (
    <View className="h-16 flex-row items-center gap-3 rounded-full bg-action pl-2 pr-3">
      <Pressable
        onPress={onPress}
        disabled={!onPress}
        accessibilityRole={onPress ? "button" : undefined}
        className="flex-1 flex-row items-center gap-3 active:opacity-80"
      >
        <Avatar uri={avatarUrl} tone="surface" />
        <View className="flex-1">
          <Text
            numberOfLines={1}
            className="text-base leading-6 tracking-[0.5px] text-action-foreground"
          >
            {name}
          </Text>
          <Text
            numberOfLines={1}
            className="text-sm leading-5 tracking-[0.5px] text-secondary"
          >
            {subtitle}
          </Text>
        </View>
      </Pressable>

      <FriendRowTrailing {...trailing} name={name} disabled={disabled} />
    </View>
  );
}

function FriendRowTrailing(
  props: FriendRowTrailingProps & { name: string; disabled: boolean },
) {
  switch (props.variant) {
    case "actions":
      return (
        <View className="flex-row items-center gap-2">
          <RoundButton
            icon="chat-bubble-outline"
            variant="tonal"
            accessibilityLabel={`Message ${props.name}`}
            disabled={props.disabled}
            onPress={props.onMessage}
          />
          <RowIconButton
            icon="more-vert"
            size={24}
            accessibilityLabel={`More actions for ${props.name}`}
            disabled={props.disabled}
            onPress={props.onMore}
          />
        </View>
      );
    default:
      return props.variant satisfies never;
  }
}

interface RowIconButtonProps {
  icon: MaterialIconName;
  size: number;
  accessibilityLabel: string;
  disabled: boolean;
  onPress: () => void;
}

function RowIconButton({
  icon,
  size,
  accessibilityLabel,
  disabled,
  onPress,
}: RowIconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={{ top: 12, bottom: 12, left: 4, right: 8 }}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      className={cn("active:opacity-60", disabled && "opacity-50")}
    >
      <MaterialIcons name={icon} size={size} className="text-secondary" />
    </Pressable>
  );
}
