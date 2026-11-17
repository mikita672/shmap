import { useState } from "react";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Popup } from "@/components/ui/popup";
import { Text } from "@/components/ui/text";
import { TextField } from "@/components/ui/text-field";
import { MaterialIcons } from "@/lib/icons";
import type { ChatResponse } from "@/lib/types/api";

const MAX_NOTE_LENGTH = 200;

export interface AskPopupProps {
  chat?: ChatResponse;
  visible: boolean;
  onClose: () => void;
  onSuggest: (note: string) => void;
}

export function AskPopup({ chat, visible, onClose, onSuggest }: AskPopupProps) {
  const [note, setNote] = useState("");

  return (
    <Popup visible={visible} onClose={onClose}>
      <View className="items-center px-6 pb-6 pt-8">
        <View className="h-14 w-14 items-center justify-center rounded-full bg-action">
          <MaterialIcons
            name="auto-awesome"
            size={28}
            className="text-action-foreground"
          />
        </View>

        <View className="w-full items-center gap-2 pb-5 pt-4">
          <Text className="text-center text-[22px] text-card-title">
            Ask AI for places
          </Text>
          <Text className="text-center text-sm leading-5 text-card-muted">
            {getAskMessage(chat)}
          </Text>
        </View>

        <TextField
          label="Note (optional)"
          placeholder="e.g. cheap, good for kids, rainy day"
          value={note}
          onChangeText={setNote}
          maxLength={MAX_NOTE_LENGTH}
          showCount
          multiline
          containerClassName="w-full pb-6"
        />

        <View className="w-full gap-2">
          <Button
            size="xl"
            className="w-full"
            onPress={() => onSuggest(note.trim())}
          >
            <Text className="text-2xl">Suggest</Text>
          </Button>
          <Button
            variant="secondary"
            size="xl"
            className="w-full"
            onPress={onClose}
          >
            <Text className="text-xl">Cancel</Text>
          </Button>
        </View>
      </View>
    </Popup>
  );
}

function getAskMessage(chat?: ChatResponse) {
  if (chat?.type === "GROUP") {
    return `New suggestions replace the current ones for everyone in ${chat.name}.`;
  }
  const other = chat?.members[0];
  return other
    ? `New suggestions replace the current ones for you and ${other.firstName}.`
    : "New suggestions replace the current ones for everyone in this chat.";
}
