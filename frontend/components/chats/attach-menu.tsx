import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as DropdownMenuPrimitive from "@rn-primitives/dropdown-menu";
import { RoundButton } from "@/components/ui/round-button";
import { Text } from "@/components/ui/text";
import { MaterialIcons, type MaterialIconName } from "@/lib/icons";
import { cn } from "@/lib/utils";

const MENU_GAP = 8;
const SCREEN_EDGE = 12;

export interface AttachMenuProps {
  onSendPlace?: () => void;
  onStartRoute?: () => void;
}

export function AttachMenu({ onSendPlace, onStartRoute }: AttachMenuProps) {
  const insets = useSafeAreaInsets();
  const disabled = !onSendPlace && !onStartRoute;

  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger asChild disabled={disabled}>
        <RoundButton
          icon="add"
          size="md"
          accessibilityLabel="Attach"
          disabled={disabled}
        />
      </DropdownMenuPrimitive.Trigger>

      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Overlay style={StyleSheet.absoluteFill}>
          <DropdownMenuPrimitive.Content
            side="top"
            align="start"
            sideOffset={MENU_GAP}
            insets={{
              top: insets.top + SCREEN_EDGE,
              bottom: insets.bottom + SCREEN_EDGE,
              left: SCREEN_EDGE,
              right: SCREEN_EDGE,
            }}
            className="w-[244px] rounded-[20px] bg-card py-2 shadow-md shadow-black/20 elevation-4"
          >
            <AttachMenuItem
              icon="location-on"
              label="Send place"
              onPress={onSendPlace}
            />
            <AttachMenuItem
              icon="route"
              label="Start shared route"
              onPress={onStartRoute}
            />
          </DropdownMenuPrimitive.Content>
        </DropdownMenuPrimitive.Overlay>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
}

interface AttachMenuItemProps {
  icon: MaterialIconName;
  label: string;
  onPress?: () => void;
}

function AttachMenuItem({ icon, label, onPress }: AttachMenuItemProps) {
  return (
    <DropdownMenuPrimitive.Item
      onPress={onPress}
      disabled={!onPress}
      className={cn(
        "h-[52px] flex-row items-center gap-4 px-5 active:opacity-60",
        !onPress && "opacity-50",
      )}
    >
      <MaterialIcons name={icon} size={24} className="text-card-title" />
      <Text className="text-base leading-6 text-card-title">{label}</Text>
    </DropdownMenuPrimitive.Item>
  );
}
