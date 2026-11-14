import { useState } from "react";
import { ScrollView, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PickerRow } from "@/components/chats/picker-row";
import { DateRow } from "@/components/routes/date-row";
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
import { getParticipantCandidates } from "@/lib/route-participants";
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
  const [date, setDate] = useState(() => toLocalDateString(new Date()));
  const [excludedIds, setExcludedIds] = useState<Set<number>>(() => new Set());
  const [visibility, setVisibility] = useState<RouteVisibility>("FRIENDS");

  const candidates =
    me && chat
      ? getParticipantCandidates(
          me,
          chat.members,
          route?.completion?.participants ?? [],
        )
      : [];
  const participantIds = candidates
    .filter((candidate) => !excludedIds.has(candidate.id))
    .map((candidate) => candidate.id);

  const handleToggle = (userId: number) => {
    setExcludedIds((previous) => {
      const next = new Set(previous);
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  };

  const handleSubmit = () => {
    if (participantIds.length === 0 || complete.isPending) return;
    complete.mutate(
      { finishedOn: date, participantIds, visibility },
      { onSuccess: () => router.back() },
    );
  };

  return (
    <View className="flex-1 bg-background">
      <TitleHeader title="Mark as done" />

      <ScrollView contentContainerClassName="gap-4 px-6 pt-4">
        <DateRow
          value={date}
          onChange={setDate}
          disabled={complete.isPending}
        />

        {candidates.length > 0 && (
          <View className="gap-2">
            <SectionLabel
              title={`Who took part · ${candidates.length}`}
              detail={`${participantIds.length} selected`}
            />
            {candidates.map((candidate) => (
              <PickerRow
                key={candidate.id}
                name={candidate.name}
                subtitle={candidate.subtitle}
                avatarUrl={candidate.avatarUrl}
                selected={excludedIds.has(candidate.id) ? "off" : "on"}
                onPress={() => handleToggle(candidate.id)}
              />
            ))}
          </View>
        )}

        <View className="gap-2">
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
        </View>
      </ScrollView>

      <View className="px-6 pt-4" style={{ paddingBottom: insets.bottom + 24 }}>
        <Button
          size="xl"
          disabled={participantIds.length === 0 || complete.isPending}
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
