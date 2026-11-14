import { useState } from "react";
import { ScrollView, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { VisibilityOption } from "@/components/routes/visibility-option";
import { Button } from "@/components/ui/button";
import { SectionLabel } from "@/components/ui/section-label";
import { Text } from "@/components/ui/text";
import { TitleHeader } from "@/components/ui/title-header";
import { chatQueryOptions } from "@/hooks/useChat";
import { useProfile } from "@/hooks/useProfile";
import { useRoute } from "@/hooks/useRoute";
import { useCompleteRoute } from "@/hooks/useRouteMutations";
import { toLocalDateString } from "@/lib/local-date";
import { VISIBILITY_OPTIONS } from "@/lib/route-format";
import type { RouteVisibility } from "@/lib/types/api";

export default function DoneRouteScreen() {
  const insets = useSafeAreaInsets();
  const { routeId } = useLocalSearchParams<{ routeId: string }>();
  const numericRouteId = Number(routeId);
  const { data: route } = useRoute(numericRouteId);
  const { data: chat } = useQuery({
    ...chatQueryOptions(route?.chatId ?? 0),
    enabled: route !== undefined,
  });
  const { data: me } = useProfile();
  const complete = useCompleteRoute(numericRouteId);
  const [visibility, setVisibility] = useState<RouteVisibility>("FRIENDS");

  const participantIds =
    me && chat ? [me.id, ...chat.members.map((member) => member.id)] : null;

  const handleSubmit = () => {
    if (!participantIds || complete.isPending) return;
    complete.mutate(
      {
        finishedOn: toLocalDateString(new Date()),
        participantIds,
        visibility,
      },
      { onSuccess: () => router.back() },
    );
  };

  return (
    <View className="flex-1 bg-background">
      <TitleHeader title="Mark as done" />

      <ScrollView contentContainerClassName="gap-2 px-6 pt-4">
        <SectionLabel title="Who can see it" />
        {VISIBILITY_OPTIONS.map((option) => (
          <VisibilityOption
            key={option.value}
            title={option.title}
            description={option.description}
            selected={visibility === option.value}
            disabled={complete.isPending}
            onPress={() => setVisibility(option.value)}
          />
        ))}
        <Text className="px-5 text-[13px] leading-4 text-secondary">
          Private accounts still show it only to their friends
        </Text>
      </ScrollView>

      <View className="px-6 pt-4" style={{ paddingBottom: insets.bottom + 24 }}>
        <Button
          size="xl"
          disabled={!participantIds || complete.isPending}
          onPress={handleSubmit}
        >
          <Text className="text-2xl">
            {complete.isPending ? "Saving…" : "Mark as done"}
          </Text>
        </Button>
      </View>
    </View>
  );
}
