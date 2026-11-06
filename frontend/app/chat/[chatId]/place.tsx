import { useState } from "react";
import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import {
  CopyPlaceButton,
  SendPlaceButton,
  SharePlaceButton,
  openSendPlace,
} from "@/components/place-actions";
import { PlaceMap } from "@/components/place-map";
import { AddPlaceButton } from "@/components/routes/add-place-button";
import { AddToRoutePopup } from "@/components/routes/add-to-route-popup";
import { NoteCard } from "@/components/ui/note-card";
import { TitleHeader } from "@/components/ui/title-header";
import { useChat } from "@/hooks/useChat";
import { parsePlaceParam, toChatPlace, toPlaceDetails } from "@/lib/chat-place";
import type { ChatPlace } from "@/lib/types/api";

export default function PlaceScreen() {
  const params = useLocalSearchParams<{ chatId: string; place: string }>();
  const chatId = Number(params.chatId);
  const place = parsePlaceParam(params.place);
  const { data: chat } = useChat(chatId);
  const [placeToAdd, setPlaceToAdd] = useState<ChatPlace | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  if (!place) {
    return (
      <View className="flex-1 bg-background">
        <TitleHeader title="Place" />
        <View className="flex-1 justify-center px-6">
          <NoteCard
            title="This place couldn't be opened"
            description="Go back and try again."
          />
        </View>
      </View>
    );
  }

  return (
    <>
      <PlaceMap
        initialPlace={toPlaceDetails(place)}
        leading="back"
        renderPrimaryAction={(sheetPlace) =>
          chat?.canSend && (
            <AddPlaceButton
              label="Add to route"
              onPress={() => {
                setPlaceToAdd(toChatPlace(sheetPlace));
                setIsAddOpen(true);
              }}
            />
          )
        }
        renderActions={(sheetPlace) => (
          <>
            <SendPlaceButton onPress={() => openSendPlace(sheetPlace)} />
            <CopyPlaceButton place={sheetPlace} />
            <SharePlaceButton place={sheetPlace} />
          </>
        )}
      />

      <AddToRoutePopup
        chatId={chatId}
        place={placeToAdd}
        visible={isAddOpen}
        onClose={() => setIsAddOpen(false)}
      />
    </>
  );
}
