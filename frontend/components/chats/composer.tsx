import { useState } from "react";
import { TextInput, View } from "react-native";
import { RoundButton } from "@/components/ui/round-button";

const MAX_LENGTH = 2000;

export interface ComposerProps {
  onSend?: (text: string) => void;
  onPickPlace?: () => void;
}

export function Composer({ onSend, onPickPlace }: ComposerProps) {
  const [text, setText] = useState("");
  const trimmed = text.trim();

  const handleSend = () => {
    if (!onSend || !trimmed) return;
    onSend(trimmed);
    setText("");
  };

  return (
    <View className="flex-row items-end gap-2 bg-background px-3 py-2">
      <RoundButton
        icon="location-on"
        size="md"
        accessibilityLabel="Send a place"
        disabled={!onPickPlace}
        onPress={onPickPlace}
      />
      <View className="min-h-12 flex-1 justify-center rounded-3xl bg-surface px-5">
        <TextInput
          value={text}
          onChangeText={setText}
          multiline
          maxLength={MAX_LENGTH}
          placeholder="Message"
          accessibilityLabel="Message"
          className="max-h-[134px] py-3 text-base text-on-surface placeholder:text-on-surface-muted"
        />
      </View>
      <RoundButton
        icon="send"
        variant="filled"
        size="md"
        accessibilityLabel="Send"
        disabled={!onSend || !trimmed}
        onPress={handleSend}
      />
    </View>
  );
}
