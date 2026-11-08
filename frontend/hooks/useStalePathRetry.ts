import { useEffect, useRef } from "react";
import { useIsMutating } from "@tanstack/react-query";
import { routeEditMutationKey } from "@/hooks/useRouteMutations";
import type { RouteResponse } from "@/lib/types/api";

const STALE_AFTER_MS = 30_000;

export function useStalePathRetry(
  route: RouteResponse | undefined,
  retry: () => void,
) {
  const editsInFlight = useIsMutating({
    mutationKey: routeEditMutationKey(route?.id ?? 0),
  });
  const retriedForRef = useRef<string | null>(null);
  const retryRef = useRef(retry);

  useEffect(() => {
    retryRef.current = retry;
  });

  const isServerPending =
    route !== undefined &&
    route.path.status === "PENDING" &&
    editsInFlight === 0;
  const updatedAt = route?.updatedAt;

  useEffect(() => {
    if (!isServerPending || !updatedAt) return;
    if (retriedForRef.current === updatedAt) return;

    const waitMs = new Date(updatedAt).getTime() + STALE_AFTER_MS - Date.now();
    const timer = setTimeout(
      () => {
        retriedForRef.current = updatedAt;
        retryRef.current();
      },
      Math.max(0, waitMs),
    );
    return () => clearTimeout(timer);
  }, [isServerPending, updatedAt]);
}
