import { router, useLocalSearchParams } from "expo-router";
import { SendPlaceButton } from "@/components/place-actions";
import { PlaceMap } from "@/components/place-map";
import { useChat } from "@/hooks/useChat";
import { useSendMessage } from "@/hooks/useSendMessage";
import type { PlaceDetails } from "@/lib/api/geocoding";
import { toChatPlace } from "@/lib/chat-place";

export default function PickPlaceScreen() {
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const { data: chat } = useChat(Number(chatId));
  const send = useSendMessage(Number(chatId));

  const chatName =
    chat?.type === "GROUP" ? chat.name : chat?.members[0]?.firstName;
  const label = chatName ? `Send to ${chatName}` : "Send";

  const handleSend = (place: PlaceDetails) => {
    send.mutate({ place: toChatPlace(place) });
    router.back();
  };

  return (
    <PlaceMap
      leading="back"
      sheetOpensExpanded
      renderActions={(place) => (
        <SendPlaceButton label={label} onPress={() => handleSend(place)} />
      )}
    />
  );
}
