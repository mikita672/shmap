import { useMemo } from "react";
import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { RouteCardList } from "@/components/routes/route-card-list";
import { ScreenHeader } from "@/components/ui/screen-header";
import {
  profileRoutesQueryOptions,
  useProfileRoutes,
} from "@/hooks/useProfileRoutes";

export function ProfileRoutesScreen() {
  const { username } = useLocalSearchParams<{ username: string }>();
  const query = useProfileRoutes(username);
  const queryKey = useMemo(
    () => profileRoutesQueryOptions(username).queryKey,
    [username],
  );

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Routes" />

      <RouteCardList
        query={query}
        queryKey={queryKey}
        errorMessage="Couldn't load routes"
        empty={null}
      />
    </View>
  );
}
