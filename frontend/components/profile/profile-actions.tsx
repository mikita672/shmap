import { View, type StyleProp, type ViewStyle } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { MaterialIcons } from "@/lib/icons";
import { cn } from "@/lib/utils";

export interface ProfileActionsProps {
  onShareProfile?: () => void;
  onShowQrCode?: () => void;
  onResetPassword?: () => void;
  onEditProfile?: () => void;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

const actionButtonClassName = "bg-action active:bg-action/80";
const actionTextClassName = "text-action-foreground";

export function ProfileActions({
  onShareProfile,
  onShowQrCode,
  onResetPassword,
  onEditProfile,
  className,
  style,
}: ProfileActionsProps) {
  return (
    <View className={cn("gap-3", className)} style={style}>
      <View className="flex-row gap-2">
        <Button
          size="xl"
          className={cn("flex-1", actionButtonClassName)}
          onPress={onShareProfile}
        >
          <Text className={actionTextClassName}>Share profile</Text>
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

      <Button
        size="xl"
        className={actionButtonClassName}
        onPress={onResetPassword}
      >
        <Text className={actionTextClassName}>Reset password</Text>
      </Button>

      <Button
        size="xl"
        className={actionButtonClassName}
        onPress={onEditProfile}
      >
        <Text className={actionTextClassName}>Edit profile</Text>
      </Button>
    </View>
  );
}
