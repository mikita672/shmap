import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { MaterialIcons, type MaterialIconName } from "@/lib/icons";

export interface ConfirmCardProps {
  icon: MaterialIconName;
  title: string;
  message: string;
  confirmLabel: string;
  pendingLabel: string;
  isPending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmCard({
  icon,
  title,
  message,
  confirmLabel,
  pendingLabel,
  isPending = false,
  onConfirm,
  onCancel,
}: ConfirmCardProps) {
  return (
    <View className="items-center px-6 pt-8 pb-6">
      <View className="h-14 w-14 items-center justify-center rounded-full bg-action">
        <MaterialIcons
          name={icon}
          size={28}
          className="text-action-foreground"
        />
      </View>

      <View className="w-full items-center gap-2 pt-4 pb-6">
        <Text className="text-card-title text-[22px] text-center">{title}</Text>
        <Text className="text-card-muted text-sm leading-5 text-center">
          {message}
        </Text>
      </View>

      <View className="w-full gap-2">
        <Button
          variant="destructive"
          size="xl"
          className="w-full"
          disabled={isPending}
          onPress={onConfirm}
        >
          <MaterialIcons name={icon} size={24} className="text-white" />
          <Text className="font-medium">
            {isPending ? pendingLabel : confirmLabel}
          </Text>
        </Button>
        <Button
          variant="secondary"
          size="xl"
          className="w-full"
          disabled={isPending}
          onPress={onCancel}
        >
          <Text>Cancel</Text>
        </Button>
      </View>
    </View>
  );
}
