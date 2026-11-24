import { useCallback, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner-native";
import { feedMapQueryOptions, useFeedMap } from "@/hooks/useFeedMap";
import { useFriendsRoutesLayer } from "@/hooks/useFriendsRoutesLayer";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";

export function useFriendsRoutes() {
  const [on, setOn] = useFriendsRoutesLayer();
  const { data, isLoading, isFetching, isError, errorUpdatedAt } =
    useFeedMap(on);
  const announceEmptyRef = useRef(false);
  const handledErrorAtRef = useRef(0);
  const queryClient = useQueryClient();

  useRefreshOnFocus(
    useCallback(() => {
      if (!on) return;
      return queryClient.refetchQueries({
        queryKey: feedMapQueryOptions.queryKey,
        exact: true,
        stale: true,
      });
    }, [on, queryClient]),
  );

  const toggle = useCallback(() => {
    announceEmptyRef.current = !on;
    setOn(!on);
  }, [on, setOn]);

  useEffect(() => {
    if (!on || !isError || data || errorUpdatedAt === handledErrorAtRef.current)
      return;
    handledErrorAtRef.current = errorUpdatedAt;
    announceEmptyRef.current = false;
    toast.error("Couldn't load friends' routes");
    setOn(false);
  }, [on, isError, data, errorUpdatedAt, setOn]);

  useEffect(() => {
    if (!on || !announceEmptyRef.current || !data || isFetching) return;
    announceEmptyRef.current = false;
    if (data.routes.length === 0) toast("No friends' routes yet");
  }, [on, data, isFetching]);

  return {
    on,
    toggle,
    loading: on && isLoading,
    routes: on ? data?.routes : undefined,
  };
}
