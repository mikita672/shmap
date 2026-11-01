import { useRef, useState } from "react";
import { View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as Crypto from "expo-crypto";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "sonner-native";
import { PlaceSummary } from "@/components/chats/place-summary";
import { SendTargetPicker } from "@/components/chats/send-target-picker";
import { Button } from "@/components/ui/button";
import { NoteCard } from "@/components/ui/note-card";
import { Text } from "@/components/ui/text";
import { TitleHeader } from "@/components/ui/title-header";
import { useChats } from "@/hooks/useChats";
import { useFriends } from "@/hooks/useFriends";
import { useSendPlace, type SendPlaceResult } from "@/hooks/useSendPlace";
import { parsePlaceParam } from "@/lib/chat-place";
import { sendTargetKey, type SendTarget } from "@/lib/send-target";

export default function SendPlaceScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ place: string }>();
  const place = parsePlaceParam(params.place);
  const [selected, setSelected] = useState<Map<string, SendTarget>>(
    () => new Map(),
  );
  const { data: chats } = useChats();
  const { data: friends } = useFriends();
  const sendPlace = useSendPlace();
  const clientIds = useRef(new Map<string, string>());

  const handleToggle = (target: SendTarget) => {
    setSelected((current) => {
      const next = new Map(current);
      const key = sendTargetKey(target);
      if (next.has(key)) next.delete(key);
      else next.set(key, target);
      return next;
    });
  };

  const getTargetName = (target: SendTarget) =>
    target.kind === "group"
      ? chats?.find((chat) => chat.id === target.chatId)?.name
      : friends?.find((friend) => friend.user.id === target.userId)?.user
          .firstName;

  const handleResults = (results: SendPlaceResult[]) => {
    for (const result of results) {
      if (result.ok) clientIds.current.delete(sendTargetKey(result.target));
    }
    const failed = results.filter((result) => !result.ok);
    if (failed.length === 0) {
      const name = results.length === 1 && getTargetName(results[0].target);
      toast.success(
        name ? `Sent to ${name}` : `Sent to ${results.length} chats`,
      );
      router.back();
      return;
    }

    toast.error(
      results.length === 1
        ? "Couldn't send the place"
        : `Couldn't send to ${failed.length} of ${results.length} chats`,
    );
    setSelected(
      new Map(
        failed.map((result) => [sendTargetKey(result.target), result.target]),
      ),
    );
  };

  const withClientId = (target: SendTarget) => {
    const key = sendTargetKey(target);
    let clientId = clientIds.current.get(key);
    if (!clientId) {
      clientId = Crypto.randomUUID();
      clientIds.current.set(key, clientId);
    }
    return { target, clientId };
  };

  const handleSend = () => {
    if (!place || selected.size === 0 || sendPlace.isPending) return;
    sendPlace.mutate(
      { place, targets: Array.from(selected.values(), withClientId) },
      { onSuccess: handleResults },
    );
  };

  return (
    <View className="flex-1 bg-background">
      <TitleHeader title="Send place" />

      {!place ? (
        <View className="flex-1 justify-center px-6">
          <NoteCard
            title="This place couldn't be opened"
            description="Go back and pick the place again."
          />
        </View>
      ) : (
        <>
          <View className="px-6 pt-2">
            <PlaceSummary place={place} />
          </View>
          <SendTargetPicker
            selectedKeys={new Set(selected.keys())}
            onToggle={handleToggle}
            onAddFriends={() => router.push("/friends/add")}
          />
          <View
            className="px-6 pt-4"
            style={{ paddingBottom: insets.bottom + 24 }}
          >
            <Button
              size="xl"
              disabled={selected.size === 0 || sendPlace.isPending}
              onPress={handleSend}
            >
              <Text className="text-2xl">
                {sendPlace.isPending
                  ? "Sending…"
                  : selected.size > 0
                    ? `Send · ${selected.size}`
                    : "Send"}
              </Text>
            </Button>
          </View>
        </>
      )}
    </View>
  );
}
