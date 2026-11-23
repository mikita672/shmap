import { useMemo } from "react";
import { View } from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { RouteCardList } from "@/components/routes/route-card-list";
import { NoteCard } from "@/components/ui/note-card";
import { ScreenHeader } from "@/components/ui/screen-header";
import {
  profileRoutesQueryOptions,
  useProfileRoutes,
} from "@/hooks/useProfileRoutes";
import {
  publicProfileQueryOptions,
  usePublicProfile,
} from "@/hooks/usePublicProfile";
import { AuthErrorCode } from "@/lib/types/api";
import { isErrorCode } from "@/lib/utils/error";

export function ProfileRoutesScreen() {
  const { username } = useLocalSearchParams<{ username: string }>();
  const { data: profile } = usePublicProfile(username);
  const queryClient = useQueryClient();
  const query = useProfileRoutes(username);
  const queryKey = useMemo(
    () => profileRoutesQueryOptions(username).queryKey,
    [username],
  );

  const isSelf = profile?.relationship === "SELF";
  const firstName = profile?.user.firstName;
  const title = isSelf
    ? "Your routes"
    : firstName
      ? `${firstName}'s routes`
      : "Routes";

  const { data, error } = query;
  const note = data ? null : getErrorNote(error);

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title={title} />

      {note ? (
        <View className="flex-1 justify-center px-6">{note}</View>
      ) : (
        <RouteCardList
          query={query}
          queryKey={queryKey}
          errorMessage="Couldn't load routes"
          onRefreshed={() =>
            queryClient.invalidateQueries({
              queryKey: publicProfileQueryOptions(username).queryKey,
              exact: true,
            })
          }
          empty={
            <NoteCard
              title="No routes yet"
              description={
                isSelf
                  ? "Routes you mark as done show up here"
                  : firstName
                    ? `Routes ${firstName} finishes and shares with you show up here`
                    : "Routes they finish and share with you show up here"
              }
            />
          }
        />
      )}
    </View>
  );
}

function getErrorNote(error: unknown) {
  if (isErrorCode(error, AuthErrorCode.PRIVATE_ACCOUNT)) {
    return (
      <NoteCard
        className="self-stretch"
        title="This account is private"
        description="Become friends to see their routes"
      />
    );
  }
  if (isErrorCode(error, AuthErrorCode.USER_NOT_FOUND)) {
    return (
      <NoteCard
        className="self-stretch"
        title="This profile isn't available"
        description="The account may have been deleted, or the link is broken"
      />
    );
  }
  return null;
}
