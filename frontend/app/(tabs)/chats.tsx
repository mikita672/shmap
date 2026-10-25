import { View } from "react-native";
import { ChatsTopBar } from "@/components/chats/chats-top-bar";

export default function ChatsScreen() {
  return (
    <View className="flex-1 bg-chat-list">
      <ChatsTopBar />
    </View>
  );
}
