import { ActivityIndicator, ScrollView, View } from "react-native";
import { RoutePickerRow } from "@/components/routes/route-picker-row";
import { Button } from "@/components/ui/button";
import { Popup } from "@/components/ui/popup";
import { RoundButton } from "@/components/ui/round-button";
import { Text } from "@/components/ui/text";
import { useChatRoutes } from "@/hooks/useChatRoutes";
import { MaterialIcons } from "@/lib/icons";
import type { ChatPlace } from "@/lib/types/api";
import { getErrorMessage } from "@/lib/utils/error";

export interface AddToRoutePopupProps {
  chatId: number;
  place: ChatPlace | null;
  visible: boolean;
  onClose: () => void;
}

export function AddToRoutePopup({
  chatId,
  place,
  visible,
  onClose,
}: AddToRoutePopupProps) {
  const { data: routes, isPending, error, refetch } = useChatRoutes(chatId);

  return (
    <Popup visible={visible} onClose={onClose} className="pb-5 pt-6">
      <View className="items-center gap-1 px-6 pb-4">
        <View className="mb-1 h-14 w-14 items-center justify-center rounded-full bg-action">
          <MaterialIcons
            name="route"
            size={28}
            className="text-action-foreground"
          />
        </View>
        <Text className="text-center text-xl leading-7 tracking-[0.5px] text-card-title">
          Add to route
        </Text>
        {place && (
          <Text
            numberOfLines={1}
            className="text-center text-sm leading-5 tracking-[0.5px] text-card-muted"
          >
            {place.name}
          </Text>
        )}
      </View>

      {isPending ? (
        <ActivityIndicator size="large" className="py-6 text-card-muted" />
      ) : !routes ? (
        <View className="items-center gap-4 px-6 py-2">
          <Text className="text-center text-sm leading-5 text-card-muted">
            {getErrorMessage(error, "Couldn't load routes")}
          </Text>
          <Button onPress={() => refetch()}>
            <Text>Retry</Text>
          </Button>
        </View>
      ) : (
        <ScrollView
          className="max-h-[296px]"
          contentContainerClassName="gap-2 px-5"
        >
          {routes.map((route) => (
            <RoutePickerRow key={route.id} variant="route" route={route} />
          ))}
        </ScrollView>
      )}

      <RoundButton
        icon="close"
        accessibilityLabel="Close"
        hitSlop={8}
        onPress={onClose}
        className="absolute right-4 top-4"
      />
    </Popup>
  );
}
