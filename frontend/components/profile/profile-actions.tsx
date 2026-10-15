import { View, type StyleProp, type ViewStyle } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { MaterialIcons } from "@/lib/icons";
import { cn } from "@/lib/utils";

export interface ProfileActionsProps {
  onShareProfile?: () => void;
  onShowQrCode?: () => void;
  onOpenSettings?: () => void;
  onEditProfile?: () => void;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

export function ProfileActions({
  onShareProfile,
  onShowQrCode,
  onOpenSettings,
  onEditProfile,
  className,
  style,
}: ProfileActionsProps) {
  return (
    <View className={cn("gap-3", className)} style={style}>
      <View className="flex-row gap-2">
        <Button
          variant="secondary"
          size="xl"
          className="flex-1"
          onPress={onShareProfile}
        >
          <Text>Share profile</Text>
        </Button>
        <Button
          size="icon-xl"
          className="bg-action-accent active:bg-action-accent/80"
          onPress={onShowQrCode}
          accessibilityLabel="Show profile QR code"
        >
          <MaterialIcons
            name="qr-code-2"
            size={36}
            className="text-action-accent-foreground"
          />
        </Button>
      </View>

      <Button variant="secondary" size="xl" onPress={onOpenSettings}>
        <Text>Settings</Text>
      </Button>

      <Button variant="secondary" size="xl" onPress={onEditProfile}>
        <Text>Edit profile</Text>
      </Button>
    </View>
  );
}
