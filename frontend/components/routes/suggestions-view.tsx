import { useState } from "react";
import { View } from "react-native";
import { InterestsPopup } from "@/components/routes/interests-popup";
import { InterestsSummary } from "@/components/routes/interests-summary";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useProfile } from "@/hooks/useProfile";
import { Ionicons } from "@/lib/icons";
import type { RouteResponse } from "@/lib/types/api";

export interface SuggestionsViewProps {
  route: RouteResponse;
  memberCount?: number;
  onClose: () => void;
}

export function SuggestionsView({
  route,
  memberCount,
  onClose,
}: SuggestionsViewProps) {
  const { data: profile } = useProfile();
  const [isInterestsOpen, setIsInterestsOpen] = useState(false);
  const [interestsKey, setInterestsKey] = useState(0);
  const canEditPlan = route.canEdit && route.completion === null;
  const myInterests =
    route.interests.find(({ user }) => user.id === profile?.id)?.categories ??
    [];

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

      <InterestsPopup
        key={interestsKey}
        routeId={route.id}
        initial={myInterests}
        visible={isInterestsOpen}
        onClose={() => setIsInterestsOpen(false)}
      />
    </View>
  );
}
