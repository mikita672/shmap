import { useCallback, useEffect, useRef, useState } from "react";
import {
  getFriendsRoutesLayer,
  setFriendsRoutesLayer,
} from "@/lib/storage/map-layers";

export function useFriendsRoutesLayer() {
  const [on, setOnState] = useState(false);
  const changedByUserRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    getFriendsRoutesLayer().then((stored) => {
      if (!cancelled && !changedByUserRef.current) setOnState(stored);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const setOn = useCallback((next: boolean) => {
    changedByUserRef.current = true;
    setOnState(next);
    void setFriendsRoutesLayer(next);
  }, []);

  return [on, setOn] as const;
}
