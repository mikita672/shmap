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
  newestKey: string | undefined,
  itemCount: number,
  latestSendAt: number,
) {
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [seenSendAt, setSeenSendAt] = useState(latestSendAt);
  const isUserScrollingRef = useRef(false);
  const momentumAfterDragRef = useRef(false);
  const followPendingRef = useRef(false);
  const checkNextScrollRef = useRef(false);
  const keyboardMovingRef = useRef(false);
  const insetTopRef = useRef(0);
  const previousRef = useRef({ newestKey, itemCount, latestSendAt });

  if (latestSendAt > seenSendAt) {
    setSeenSendAt(latestSendAt);
    setIsAtBottom(true);
  }

  useLayoutEffect(() => {
    const previous = previousRef.current;
    previousRef.current = { newestKey, itemCount, latestSendAt };
    if (latestSendAt > previous.latestSendAt) {
      isUserScrollingRef.current = false;
      momentumAfterDragRef.current = false;
    }
    if (
      isAtBottom &&
      previous.newestKey !== undefined &&
      newestKey !== previous.newestKey &&
      itemCount > previous.itemCount
    ) {
      followPendingRef.current = true;
    }
  }, [newestKey, itemCount, latestSendAt, isAtBottom]);

  useEffect(() => {
    const setMoving = (moving: boolean) => () => {
      keyboardMovingRef.current = moving;
    };
    const subscriptions = [
      KeyboardEvents.addListener("keyboardWillShow", setMoving(true)),
      KeyboardEvents.addListener("keyboardWillHide", setMoving(true)),
      KeyboardEvents.addListener("keyboardDidShow", setMoving(false)),
      KeyboardEvents.addListener("keyboardDidHide", setMoving(false)),
    ];
    return () => subscriptions.forEach((subscription) => subscription.remove());
  }, []);

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

  const syncWithNextScroll = () => {
    checkNextScrollRef.current = true;
    followPendingRef.current = false;
  };

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentInset } = event.nativeEvent;
    const distance = contentOffset.y + contentInset.top;
    const isKeyboardMoving = keyboardMovingRef.current;
    const isChecking = checkNextScrollRef.current;
    if (!isKeyboardMoving) checkNextScrollRef.current = false;

    if (distance <= AT_BOTTOM_THRESHOLD) {
      setIsAtBottom(true);
    } else if (
      !isKeyboardMoving &&
      (isUserScrollingRef.current || isChecking)
    ) {
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
    isUserScrollingRef.current = false;
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
