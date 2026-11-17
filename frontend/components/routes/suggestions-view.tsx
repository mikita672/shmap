import { useState } from "react";
import { View } from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import { AskButton } from "@/components/routes/ask-button";
import { AskPopup } from "@/components/routes/ask-popup";
import { InterestsPopup } from "@/components/routes/interests-popup";
import { InterestsSummary } from "@/components/routes/interests-summary";
import { SuggestionCard } from "@/components/routes/suggestion-card";
import { SuggestionSetHeader } from "@/components/routes/suggestion-set-header";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useProfile } from "@/hooks/useProfile";
import { useAddStop } from "@/hooks/useRouteMutations";
import {
  routeSuggestionsQueryOptions,
  useSuggestPlaces,
  useSuggestStatus,
} from "@/hooks/useRouteSuggestions";
import { Ionicons } from "@/lib/icons";
import { MAX_ROUTE_STOPS } from "@/lib/route-format";
import type {
  ChatResponse,
  RouteResponse,
  RouteSuggestionResponse,
  RouteSuggestionsResponse,
} from "@/lib/types/api";

export interface SuggestionsViewProps {
  route: RouteResponse;
  chat?: ChatResponse;
  suggestions?: RouteSuggestionsResponse | null;
  memberCount?: number;
  onClose: () => void;
}

export function SuggestionsView({
  route,
  chat,
  suggestions,
  memberCount,
  onClose,
}: SuggestionsViewProps) {
  const { data: profile } = useProfile();
  const [isInterestsOpen, setIsInterestsOpen] = useState(false);
  const [interestsKey, setInterestsKey] = useState(0);
  const [isAskOpen, setIsAskOpen] = useState(false);
  const [askKey, setAskKey] = useState(0);
  const canEditPlan = route.canEdit && route.completion === null;
  const myInterests =
    route.interests.find(({ user }) => user.id === profile?.id)?.categories ??
    [];
  const queryClient = useQueryClient();
  const addStop = useAddStop(route.id);
  const isFull = route.stops.length >= MAX_ROUTE_STOPS;
  const suggest = useSuggestPlaces(route.id);
  const { isAsking } = useSuggestStatus(route.id);

  const handleAdd = (suggestion: RouteSuggestionResponse) => {
    addStop.mutate(suggestion.place, {
      onSuccess: () => {
        queryClient.setQueryData(
          routeSuggestionsQueryOptions(route.id).queryKey,
          (current) =>
            current && {
              ...current,
              suggestions: current.suggestions.filter(
                ({ id }) => id !== suggestion.id,
              ),
            },
        );
      },
    });
  };

  return (
    <View className="gap-3">
      <View className="flex-row items-center gap-2">
        <Text className="flex-1 text-lg font-medium leading-6 text-on-surface">
          Suggestions
        </Text>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onPress={onClose}
          accessibilityLabel="Close suggestions"
        >
          <Ionicons name="close" size={18} className="text-on-surface-muted" />
        </Button>
      </View>

      <InterestsSummary
        interests={route.interests}
        memberCount={memberCount}
        onEdit={
          canEditPlan && profile
            ? () => {
                setInterestsKey((key) => key + 1);
                setIsInterestsOpen(true);
              }
            : undefined
        }
      />

      {canEditPlan && (
        <View className="gap-1.5">
          <AskButton
            isAsking={isAsking}
            onPress={() => {
              setAskKey((key) => key + 1);
              setIsAskOpen(true);
            }}
          />
          {isAsking && (
            <Text className="text-center text-[13px] leading-[18px] text-on-surface-muted">
              This can take up to half a minute
            </Text>
          )}
        </View>
      )}

      {suggestions && suggestions.suggestions.length > 0 && (
        <>
          <View className="h-px bg-on-surface-muted/25" />
          <SuggestionSetHeader suggestions={suggestions} myId={profile?.id} />
          <View className="gap-2">
            {suggestions.suggestions.map((suggestion) => (
              <SuggestionCard
                key={suggestion.id}
                suggestion={suggestion}
                onAdd={canEditPlan ? () => handleAdd(suggestion) : undefined}
                isAdding={
                  addStop.isPending && addStop.variables === suggestion.place
                }
                addDisabled={isFull || addStop.isPending}
              />
            ))}
          </View>
          <Text className="text-center text-[11px] leading-4 text-on-surface-muted">
            Places © OpenStreetMap contributors
          </Text>
        </>
      )}

      <InterestsPopup
        key={`interests-${interestsKey}`}
        routeId={route.id}
        initial={myInterests}
        visible={isInterestsOpen}
        onClose={() => setIsInterestsOpen(false)}
      />

      <AskPopup
        key={`ask-${askKey}`}
        chat={chat}
        visible={isAskOpen}
        onClose={() => setIsAskOpen(false)}
        onSuggest={(note) => {
          setIsAskOpen(false);
          suggest.mutate({ note: note || undefined });
        }}
      />
    </View>
  );
}
