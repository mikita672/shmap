import { useCallback, useState } from "react";
import { BackHandler, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { ChatsList } from "@/components/chats/chats-list";
import { ChatsTopBar } from "@/components/chats/chats-top-bar";

export default function ChatsScreen() {
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const isSearching = searchQuery !== null;

  useFocusEffect(
    useCallback(() => {
      if (!isSearching) return;
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          setSearchQuery(null);
          return true;
        },
      );
      return () => subscription.remove();
    }, [isSearching]),
  );

  return (
    <View className="flex-1 bg-chat-list">
      <ChatsTopBar
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
      />
      <ChatsList searchQuery={searchQuery ?? ""} />
    </View>
  );
}
