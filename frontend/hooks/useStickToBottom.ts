import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import {
  Platform,
  type FlatList,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";
import { KeyboardEvents } from "react-native-keyboard-controller";

const AT_BOTTOM_THRESHOLD = 40;

export function useStickToBottom<T>(
  listRef: RefObject<FlatList<T> | null>,
  latestSendAt: number,
  newestKey: string | undefined,
) {
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [seenSendAt, setSeenSendAt] = useState(latestSendAt);
  const isUserScrollingRef = useRef(false);
  const momentumAfterDragRef = useRef(false);
  const checkNextScrollRef = useRef(false);
  const keyboardMovingRef = useRef(false);
  const lastDistanceRef = useRef(0);
  const insetTopRef = useRef(0);
  const previousSendAtRef = useRef(latestSendAt);

  if (latestSendAt > seenSendAt) {
    setSeenSendAt(latestSendAt);
    setIsAtBottom(true);
  }

  useLayoutEffect(() => {
    if (latestSendAt > previousSendAtRef.current) {
      isUserScrollingRef.current = false;
      momentumAfterDragRef.current = false;
    }
    previousSendAtRef.current = latestSendAt;
  }, [latestSendAt]);

  useLayoutEffect(() => {
    checkNextScrollRef.current = false;
  }, [newestKey]);

  useEffect(() => {
    const onMoveStart = () => {
      keyboardMovingRef.current = true;
      checkNextScrollRef.current = false;
    };
    const onMoveEnd = () => {
      keyboardMovingRef.current = false;
    };
    const subscriptions = [
      KeyboardEvents.addListener("keyboardWillShow", onMoveStart),
      KeyboardEvents.addListener("keyboardWillHide", onMoveStart),
      KeyboardEvents.addListener("keyboardDidShow", onMoveEnd),
      KeyboardEvents.addListener("keyboardDidHide", onMoveEnd),
    ];
    return () => subscriptions.forEach((subscription) => subscription.remove());
  }, []);

  const scrollToBottom = (animated = true) => {
    isUserScrollingRef.current = false;
    momentumAfterDragRef.current = false;
    setIsAtBottom(true);
    listRef.current?.scrollToOffset({
      offset: Platform.OS === "ios" ? -insetTopRef.current : 0,
      animated,
    });
  };

  const syncWithNextScroll = () => {
    checkNextScrollRef.current = true;
  };

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentInset } = event.nativeEvent;
    const distance = contentOffset.y + contentInset.top;
    const movedAway = distance > lastDistanceRef.current + 1;
    lastDistanceRef.current = distance;
    const isKeyboardMoving = keyboardMovingRef.current;
    const isChecking = checkNextScrollRef.current;
    checkNextScrollRef.current = false;

    if (distance <= AT_BOTTOM_THRESHOLD) {
      setIsAtBottom(true);
    } else if (
      !isKeyboardMoving &&
      (isUserScrollingRef.current || isChecking)
    ) {
      setIsAtBottom(false);
    }

    if (
      isAtBottom &&
      movedAway &&
      !isUserScrollingRef.current &&
      !isKeyboardMoving &&
      !isChecking
    ) {
      scrollToBottom(false);
    }
  };

  const onScrollBeginDrag = () => {
    isUserScrollingRef.current = true;
    momentumAfterDragRef.current = false;
    checkNextScrollRef.current = false;
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
    const wasUserScrolling = isUserScrollingRef.current;
    isUserScrollingRef.current = false;
    if (
      isAtBottom &&
      !wasUserScrolling &&
      !keyboardMovingRef.current &&
      lastDistanceRef.current > 1
    ) {
      scrollToBottom(false);
    }
  };

  const onContentInsetChange = (insets: { top: number }) => {
    insetTopRef.current = insets.top;
  };

  return {
    isAtBottom,
    scrollToBottom,
    syncWithNextScroll,
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
