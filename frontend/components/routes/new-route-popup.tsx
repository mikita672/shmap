import { useState } from "react";
import { View } from "react-native";
import { TravelModeSwitch } from "@/components/routes/travel-mode-switch";
import { Button } from "@/components/ui/button";
import { Popup } from "@/components/ui/popup";
import { Text } from "@/components/ui/text";
import { TextField } from "@/components/ui/text-field";
import { useCreateRoute } from "@/hooks/useRouteMutations";
import { MaterialIcons } from "@/lib/icons";
import type { ChatResponse, RouteResponse, TravelMode } from "@/lib/types/api";

const MAX_NAME_LENGTH = 50;

export interface NewRoutePopupProps {
  chat: ChatResponse;
  visible: boolean;
  onClose: () => void;
  onCreated: (route: RouteResponse) => void;
}

export function NewRoutePopup({
  chat,
  visible,
  onClose,
  onCreated,
}: NewRoutePopupProps) {
  const [name, setName] = useState("");
  const [travelMode, setTravelMode] = useState<TravelMode>("WALKING");
  const createRoute = useCreateRoute(chat.id);
  const trimmedName = name.trim();

  const reset = () => {
    setName("");
    setTravelMode("WALKING");
  };

  const handleClose = () => {
    if (createRoute.isPending) return;
    reset();
    onClose();
  };

  const handleCreate = () => {
    if (!trimmedName || createRoute.isPending) return;
    createRoute.mutate(
      { name: trimmedName, travelMode },
      {
        onSuccess: (route) => {
          reset();
          onCreated(route);
        },
      },
    );
  };

  return (
    <Popup visible={visible} onClose={handleClose}>
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
            {getDescription(chat)}
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
            onSubmitEditing={handleCreate}
            editable={!createRoute.isPending}
          />
          <View className="flex-row items-center pl-7">
            <Text className="flex-1 text-sm leading-5 text-secondary">
              Travel mode
            </Text>
            <TravelModeSwitch
              value={travelMode}
              onValueChange={createRoute.isPending ? undefined : setTravelMode}
            />
          </View>
        </View>

        <View className="w-full gap-2">
          <Button
            size="xl"
            className="w-full"
            disabled={!trimmedName || createRoute.isPending}
            onPress={handleCreate}
          >
            <Text className="text-2xl">
              {createRoute.isPending ? "Creating…" : "Create"}
            </Text>
          </Button>
          <Button
            variant="secondary"
            size="xl"
            className="w-full"
            disabled={createRoute.isPending}
            onPress={handleClose}
          >
            <Text className="text-xl">Cancel</Text>
          </Button>
        </View>
      </View>
    </Popup>
  );
}

function getDescription(chat: ChatResponse) {
  if (chat.type === "GROUP") {
    return `Everyone in ${chat.name} can add places and change the route.`;
  }
  const other = chat.members[0];
  return other
    ? `You and ${other.firstName} can add places and change the route.`
    : "Everyone in this chat can add places and change the route.";
}
