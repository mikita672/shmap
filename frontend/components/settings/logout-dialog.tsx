import { Modal, Pressable, View } from "react-native";
import { Button } from "@/components/ui/button";
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
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={handleCancel}
    >
      <View className="flex-1 items-center justify-center px-6">
        <Pressable
          className="absolute inset-0 bg-black/60"
          onPress={handleCancel}
          accessible={false}
          importantForAccessibility="no"
        />

        <View
          accessibilityViewIsModal
          className="w-full max-w-[344px] items-center rounded-[32px] bg-card px-6 pt-8 pb-6"
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
              size="xl"
              className="w-full bg-action active:bg-action/80"
              disabled={isPending}
              onPress={handleCancel}
            >
              <Text className="text-action-foreground">Cancel</Text>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}
