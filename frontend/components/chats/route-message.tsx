import { Pressable } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { RouteMessageCard } from "@/components/chats/route-message-card";
import { routeQueryOptions } from "@/hooks/useRoute";
import { AuthErrorCode, type ChatRoute } from "@/lib/types/api";
import { isErrorCode } from "@/lib/utils/error";

export interface RouteMessageProps {
  route: ChatRoute;
  text: string | null;
  time?: string;
  isMine: boolean;
  senderName?: string;
  onSenderPress?: () => void;
}

export function RouteMessage({
  route: messageRoute,
  text,
  time,
  isMine,
  senderName,
  onSenderPress,
}: RouteMessageProps) {
  const routeId = messageRoute.id;
  const { data, error, isPending } = useQuery({
    ...routeQueryOptions(routeId ?? 0),
    enabled: routeId !== null,
  });
  const cardProps = {
    name: messageRoute.name,
    text,
    time,
    isMine,
    senderName,
    onSenderPress,
  };

  if (routeId === null || isErrorCode(error, AuthErrorCode.ROUTE_NOT_FOUND)) {
    return <RouteMessageCard {...cardProps} state="deleted" />;
  }

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/route/[routeId]",
          params: { routeId: String(routeId) },
        })
      }
      accessibilityRole="button"
      accessibilityHint="Opens the route"
      className="active:opacity-80"
    >
      {data ? (
        <RouteMessageCard {...cardProps} state="active" route={data} />
      ) : (
        <RouteMessageCard
          {...cardProps}
          state={isPending ? "loading" : "error"}
        />
      )}
    </Pressable>
  );
}
