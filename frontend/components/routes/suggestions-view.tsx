import { useState } from "react";
import { View } from "react-native";
import { AskButton } from "@/components/routes/ask-button";
import { AskError } from "@/components/routes/ask-error";
import { AskPopup } from "@/components/routes/ask-popup";
import { InterestsPopup } from "@/components/routes/interests-popup";
import { InterestsSummary } from "@/components/routes/interests-summary";
import { SuggestionCard } from "@/components/routes/suggestion-card";
import { SuggestionDetails } from "@/components/routes/suggestion-details";
import { SuggestionSetHeader } from "@/components/routes/suggestion-set-header";
import { SuggestionsEmpty } from "@/components/routes/suggestions-empty";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useProfile } from "@/hooks/useProfile";
import {
  useAddSuggestion,
  usePendingSuggestionAdds,
} from "@/hooks/useRouteMutations";
import {
  useSuggestPlaces,
  useSuggestStatus,
} from "@/hooks/useRouteSuggestions";
import { getCurrentLocation } from "@/lib/current-location";
import { Ionicons, MaterialIcons } from "@/lib/icons";
import { MAX_ROUTE_STOPS } from "@/lib/route-format";
import { getErrorMessage } from "@/lib/utils/error";
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
  suggestionsError?: unknown;
  isRetryingSuggestions?: boolean;
  onRetrySuggestions?: () => void;
  memberCount?: number;
  selectedSuggestionId: number | null;
  onSelectSuggestion: (suggestionId: number | null) => void;
  onAsked?: () => void;
  onClose: () => void;
}

export function SuggestionsView({
  route,
  chat,
  suggestions,
  suggestionsError,
  isRetryingSuggestions = false,
  onRetrySuggestions,
  memberCount,
  selectedSuggestionId,
  onSelectSuggestion,
  onAsked,
  onClose,
}: SuggestionsViewProps) {
  const { data: profile } = useProfile();
  const [isInterestsOpen, setIsInterestsOpen] = useState(false);
  const [interestsKey, setInterestsKey] = useState(0);
  const [isAskOpen, setIsAskOpen] = useState(false);
  const [askKey, setAskKey] = useState(0);
  const [isLocating, setIsLocating] = useState(false);
  const [noLocation, setNoLocation] = useState(false);
  const canEditPlan = route.canEdit && route.completion === null;
  const myInterests =
    route.interests.find(({ user }) => user.id === profile?.id)?.categories ??
    [];
  const addSuggestion = useAddSuggestion(route.id);
  const pendingAddIds = usePendingSuggestionAdds(route.id);
  const isFull = route.stops.length >= MAX_ROUTE_STOPS;
  const suggest = useSuggestPlaces(route.id);
  const { isAsking, error: askError } = useSuggestStatus(route.id);
  const nobodyPicked = route.interests.every(
    ({ categories }) => categories.length === 0,
  );
  const empty = getEmptyText(suggestions, nobodyPicked, canEditPlan);

  const openInterests = () => {
    setInterestsKey((key) => key + 1);
    setIsInterestsOpen(true);
  };

  const openAsk = () => {
    setAskKey((key) => key + 1);
    setIsAskOpen(true);
  };

  const handleSuggest = async (note: string) => {
    setIsAskOpen(false);
    setNoLocation(false);
    if (route.stops.length > 0) {
      suggest.mutate({ note: note || undefined }, { onSuccess: onAsked });
      return;
    }
    setIsLocating(true);
    const near = await getCurrentLocation();
    setIsLocating(false);
    if (!near) {
      setNoLocation(true);
      return;
    }
    suggest.mutate({ note: note || undefined, near }, { onSuccess: onAsked });
  };

  const handleAdd = (suggestion: RouteSuggestionResponse) => {
    if (pendingAddIds.includes(suggestion.id)) return;
    addSuggestion.mutate(suggestion);
  };

  const selected = suggestions?.suggestions.find(
    ({ id }) => id === selectedSuggestionId,
  );

  if (selected) {
    return (
      <SuggestionDetails
        suggestion={selected}
        onClose={() => onSelectSuggestion(null)}
        onAdd={canEditPlan ? () => handleAdd(selected) : undefined}
        isAdding={pendingAddIds.includes(selected.id)}
        isFull={isFull}
      />
    );
  }

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
        onEdit={canEditPlan && profile ? openInterests : undefined}
      />

      {canEditPlan && (
        <View className="gap-1.5">
          <AskButton
            variant={nobodyPicked ? "pick" : "ask"}
            isAsking={isAsking || isLocating}
            isFull={isFull}
            onPress={nobodyPicked ? openInterests : openAsk}
          />
          {isAsking && (
            <Text className="text-center text-[13px] leading-[18px] text-on-surface-muted">
              This can take up to half a minute
            </Text>
          )}
          {askError && !noLocation && <AskError error={askError} />}
          {noLocation && (
            <View className="flex-row items-start gap-2">
              <MaterialIcons
                name="location-on"
                size={16}
                className="text-on-surface-muted"
              />
              <Text className="flex-1 text-[13px] leading-[18px] text-on-surface">
                Add a place first or allow location, so AI knows where to look.
              </Text>
            </View>
          )}
        </View>
      )}

      {!canEditPlan && (
        <Text className="text-[13px] leading-[18px] text-on-surface-muted">
          You can see these suggestions, but you can&apos;t ask for new ones or
          add them to this route.
        </Text>
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
                onPress={() => onSelectSuggestion(suggestion.id)}
                onAdd={canEditPlan ? () => handleAdd(suggestion) : undefined}
                isAdding={pendingAddIds.includes(suggestion.id)}
                addDisabled={isFull}
              />
            ))}
          </View>
          <Text className="text-center text-[11px] leading-4 text-on-surface-muted">
            Places © OpenStreetMap contributors
          </Text>
        </>
      )}

      {suggestions === undefined && suggestionsError != null && (
        <>
          <View className="h-px bg-on-surface-muted/25" />
          <View className="items-center gap-2 py-3">
            <Text className="text-center text-sm leading-5 text-on-surface-muted">
              {getErrorMessage(suggestionsError, "Couldn't load suggestions")}
            </Text>
            <Button
              variant="secondary"
              size="sm"
              disabled={isRetryingSuggestions}
              onPress={onRetrySuggestions}
            >
              <Text>{isRetryingSuggestions ? "Retrying…" : "Retry"}</Text>
            </Button>
          </View>
        </>
      )}

      {empty && (
        <>
          <View className="h-px bg-on-surface-muted/25" />
          <SuggestionsEmpty {...empty} />
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
        onSuggest={(note) => void handleSuggest(note)}
      />
    </View>
  );
}

function getEmptyText(
  suggestions: RouteSuggestionsResponse | null | undefined,
  nobodyPicked: boolean,
  canEditPlan: boolean,
) {
  if (suggestions === undefined) return null;
  if (suggestions) {
    if (suggestions.suggestions.length > 0) return null;
    return {
      title: "All suggestions added",
      description: canEditPlan
        ? "Ask AI again for more places."
        : "Everything AI suggested is on the route now.",
    };
  }
  return {
    title: "No suggestions yet",
    description: !canEditPlan
      ? "Nobody has asked AI for places on this route yet."
      : nobodyPicked
        ? "Pick what you'd like to visit. AI then suggests real places near this route from everyone's picks."
        : "Ask AI for up to 8 real places near this route, based on everyone's picks.",
  };
}
