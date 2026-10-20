import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Popup } from "@/components/ui/popup";
import { Text } from "@/components/ui/text";
import { LogoutButton } from "@/components/settings/logout-button";
import { MaterialIcons } from "@/lib/icons";

export interface LogoutDialogProps {
  visible: boolean;
  isPending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function LogoutDialog({
  visible,
  isPending = false,
  onConfirm,
  onCancel,
}: LogoutDialogProps) {
  const handleCancel = () => {
    if (!isPending) onCancel();
  };

  return (
    <Popup
      visible={visible}
      onClose={handleCancel}
      className="items-center px-6 pt-8 pb-6"
    >
      <View className="h-14 w-14 items-center justify-center rounded-full bg-action">
        <MaterialIcons
          name="logout"
          size={28}
          className="text-action-foreground"
        />
      </View>

      <View className="w-full items-center gap-2 pt-4 pb-6">
        <Text className="text-card-title text-[22px] text-center">
          Log out?
        </Text>
        <Text className="text-card-muted text-sm leading-5 text-center">
          You will need to sign in again to see your routes and friends.
        </Text>
      </View>

      <View className="w-full gap-2">
        <LogoutButton
          className="w-full"
          label={isPending ? "Logging out…" : "Log out"}
          disabled={isPending}
          onPress={onConfirm}
        />
        <Button
          variant="secondary"
          size="xl"
          className="w-full"
          disabled={isPending}
          onPress={handleCancel}
        >
          <Text>Cancel</Text>
        </Button>
      </View>
    </Popup>
  );
}
