import { useCallback, useRef } from "react";
import { useFocusEffect } from "expo-router";

export function useRefreshOnFocus(refetch: () => unknown) {
  const isFirstFocusRef = useRef(true);

  useFocusEffect(
    useCallback(() => {
      if (isFirstFocusRef.current) {
        isFirstFocusRef.current = false;
        return;
      }
      refetch();
    }, [refetch]),
  );
}
