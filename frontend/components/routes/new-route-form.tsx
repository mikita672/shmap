import { useState } from "react";
import { View } from "react-native";
import { TravelModeSwitch } from "@/components/routes/travel-mode-switch";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { TextField } from "@/components/ui/text-field";
import { MaterialIcons } from "@/lib/icons";
import type { CreateRouteRequest, TravelMode } from "@/lib/types/api";

const MAX_NAME_LENGTH = 50;

export interface NewRouteFormProps {
  description: string;
  isPending: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  onSubmit: (data: CreateRouteRequest) => void;
  onCancel: () => void;
}

export function NewRouteForm({
  description,
  isPending,
  submitLabel = "Create",
  cancelLabel = "Cancel",
  onSubmit,
  onCancel,
}: NewRouteFormProps) {
  const [name, setName] = useState("");
  const [travelMode, setTravelMode] = useState<TravelMode>("WALKING");
  const trimmedName = name.trim();

  const handleSubmit = () => {
    if (!trimmedName || isPending) return;
    onSubmit({ name: trimmedName, travelMode });
  };

  return (
    <View className="items-center px-6 pb-6 pt-8">
      <View className="h-14 w-14 items-center justify-center rounded-full bg-action">
        <MaterialIcons
          name="route"
          size={28}
          className="text-action-foreground"
        />
      </View>

      <View className="w-full items-center gap-2 pb-5 pt-4">
        <Text className="text-center text-[22px] text-card-title">
          New shared route
        </Text>
        <Text className="text-center text-sm leading-5 text-card-muted">
          {description}
        </Text>
      </View>

      <View className="w-full gap-4 pb-6">
        <TextField
          label="Name"
          value={name}
          onChangeText={setName}
          maxLength={MAX_NAME_LENGTH}
          placeholder="e.g. Old Town food walk"
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
          editable={!isPending}
        />
        <View className="flex-row items-center pl-7">
          <Text className="flex-1 text-sm leading-5 text-secondary">
            Travel mode
          </Text>
          <TravelModeSwitch
            value={travelMode}
            onValueChange={isPending ? undefined : setTravelMode}
          />
        </View>
      </View>

      <View className="w-full gap-2">
        <Button
          size="xl"
          className="w-full"
          disabled={!trimmedName || isPending}
          onPress={handleSubmit}
        >
          <Text className="text-2xl">
            {isPending ? "Creating…" : submitLabel}
          </Text>
        </Button>
        <Button
          variant="secondary"
          size="xl"
          className="w-full"
          disabled={isPending}
          onPress={onCancel}
        >
          <Text className="text-xl">{cancelLabel}</Text>
        </Button>
      </View>
    </View>
  );
}
