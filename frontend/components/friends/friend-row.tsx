import { Pressable, View } from "react-native";
import { Avatar } from "@/components/ui/avatar";
import { PillButton } from "@/components/ui/pill-button";
import { RoundButton } from "@/components/ui/round-button";
import { Text } from "@/components/ui/text";
import { MaterialIcons, type MaterialIconName } from "@/lib/icons";
import { cn } from "@/lib/utils";

const MIN_TOUCH_TARGET = 48;

type FriendRowTrailingProps =
  | { variant: "actions"; onMessage?: () => void; onMore: () => void }
  | { variant: "request"; onAccept: () => void; onDecline: () => void }
  | { variant: "sent"; onCancel: () => void }
  | { variant: "suggestion"; onAdd: () => void; onDismiss: () => void };

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
            disabled={props.disabled || !props.onMessage}
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
    case "request":
      return (
        <View className="flex-row items-center gap-2">
          <RoundButton
            icon="check"
            variant="filled"
            accessibilityLabel={`Accept ${props.name}`}
            disabled={props.disabled}
            onPress={props.onAccept}
          />
          <RoundButton
            icon="close"
            variant="tonal"
            accessibilityLabel={`Decline ${props.name}`}
            disabled={props.disabled}
            onPress={props.onDecline}
          />
        </View>
      );
    case "sent":
      return (
        <PillButton
          label="Cancel"
          variant="tonal"
          accessibilityLabel={`Cancel request to ${props.name}`}
          disabled={props.disabled}
          onPress={props.onCancel}
        />
      );
    case "suggestion":
      return (
        <View className="flex-row items-center gap-2">
          <PillButton
            label="Add"
            accessibilityLabel={`Add ${props.name}`}
            disabled={props.disabled}
            onPress={props.onAdd}
          />
          <RowIconButton
            icon="close"
            size={20}
            accessibilityLabel={`Dismiss ${props.name}`}
            disabled={props.disabled}
            onPress={props.onDismiss}
          />
        </View>
      );
    default:
      return props satisfies never;
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
  const verticalSlop = (MIN_TOUCH_TARGET - size) / 2;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={{ top: verticalSlop, bottom: verticalSlop, left: 4, right: 8 }}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      className={cn("active:opacity-60", disabled && "opacity-50")}
    >
      <MaterialIcons name={icon} size={size} className="text-secondary" />
    </Pressable>
  );
}
