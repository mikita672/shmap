import { ViewAnnotation } from "@maplibre/maplibre-react-native";
import { SuggestionPin } from "@/components/routes/suggestion-pin";
import type { RouteSuggestionResponse } from "@/lib/types/api";

export interface SuggestionLayersProps {
  suggestions: RouteSuggestionResponse[];
  selectedSuggestionId?: number | null;
  onPressSuggestion?: (suggestionId: number) => void;
}

export function SuggestionLayers({
  suggestions,
  selectedSuggestionId,
  onPressSuggestion,
}: SuggestionLayersProps) {
  return suggestions.map((suggestion) => {
    const selected = suggestion.id === selectedSuggestionId;
    return (
      <ViewAnnotation
        key={`${suggestion.id}-${selected}`}
        id={`suggestion-${suggestion.id}`}
        lngLat={[suggestion.place.longitude, suggestion.place.latitude]}
        anchor="center"
        onPress={
          onPressSuggestion ? () => onPressSuggestion(suggestion.id) : undefined
        }
      >
        <SuggestionPin category={suggestion.category} selected={selected} />
      </ViewAnnotation>
    );
  });
}
