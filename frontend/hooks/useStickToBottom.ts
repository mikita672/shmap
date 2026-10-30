import { useLayoutEffect, useRef, useState, type RefObject } from "react";
import {
  Platform,
  type FlatList,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";

const AT_BOTTOM_THRESHOLD = 40;

export function useStickToBottom<T>(
  listRef: RefObject<FlatList<T> | null>,
  newestKey: string | undefined,
  itemCount: number,
) {
  const [isAtBottom, setIsAtBottom] = useState(true);
  const isUserScrollingRef = useRef(false);
  const momentumAfterDragRef = useRef(false);
  const followPendingRef = useRef(false);
  const insetTopRef = useRef(0);
  const previousRef = useRef({ newestKey, itemCount });

  useLayoutEffect(() => {
    const previous = previousRef.current;
    previousRef.current = { newestKey, itemCount };
    if (
      isAtBottom &&
      previous.newestKey !== undefined &&
      newestKey !== previous.newestKey &&
      itemCount > previous.itemCount
    ) {
      followPendingRef.current = true;
    }
  }, [newestKey, itemCount, isAtBottom]);

  const scrollToBottom = () => {
    isUserScrollingRef.current = false;
    momentumAfterDragRef.current = false;
    followPendingRef.current = false;
    setIsAtBottom(true);
    listRef.current?.scrollToOffset({
      offset: Platform.OS === "ios" ? -insetTopRef.current : 0,
      animated: true,
    });
  };

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentInset } = event.nativeEvent;
    const distance = contentOffset.y + contentInset.top;

    if (distance <= AT_BOTTOM_THRESHOLD) {
      setIsAtBottom(true);
    } else if (isUserScrollingRef.current) {
      setIsAtBottom(false);
    }

    if (
      followPendingRef.current &&
      !isUserScrollingRef.current &&
      distance > 1
    ) {
      scrollToBottom();
    }
  };

  const onScrollBeginDrag = () => {
    isUserScrollingRef.current = true;
    momentumAfterDragRef.current = false;
    followPendingRef.current = false;
  };

  const onScrollEndDrag = () => {
    isUserScrollingRef.current = false;
    momentumAfterDragRef.current = true;
  };

  const onMomentumScrollBegin = () => {
    isUserScrollingRef.current = momentumAfterDragRef.current;
    momentumAfterDragRef.current = false;
  };

  const onMomentumScrollEnd = () => {
    isUserScrollingRef.current = false;
  };

  const onContentInsetChange = (insets: { top: number }) => {
    insetTopRef.current = insets.top;
  };

  return {
    isAtBottom,
    scrollToBottom,
    scrollHandlers: {
      onScroll,
      onScrollBeginDrag,
      onScrollEndDrag,
      onMomentumScrollBegin,
      onMomentumScrollEnd,
    },
    onContentInsetChange,
  };
}
