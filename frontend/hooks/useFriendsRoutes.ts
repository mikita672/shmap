import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner-native";
import { useFeedMap } from "@/hooks/useFeedMap";
import { useFriendsRoutesLayer } from "@/hooks/useFriendsRoutesLayer";

export function useFriendsRoutes() {
  const [on, setOn] = useFriendsRoutesLayer();
  const { data, isLoading, isFetching, isError, errorUpdatedAt } =
    useFeedMap(on);
  const announceEmptyRef = useRef(false);
  const handledErrorAtRef = useRef(0);

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
