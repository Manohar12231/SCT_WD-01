import { useCallback, useRef } from 'react';

export const useLongPress = (onLongPress, onClick, { threshold = 400 } = {}) => {
  const timerRef = useRef();
  const isLongPress = useRef(false);

  const start = useCallback((event) => {
    if (event.type === 'mousedown') {
        event.preventDefault();
    }
    isLongPress.current = false;
    timerRef.current = setTimeout(() => {
      onLongPress(event);
      isLongPress.current = true;
    }, threshold);
  }, [onLongPress, threshold]);

  const stop = useCallback((event) => {
    clearTimeout(timerRef.current);
    if (onClick && !isLongPress.current) {
      onClick(event);
    }
  }, [onClick]);

  return {
    onMouseDown: start,
    onTouchStart: start,
    onMouseUp: stop,
    onTouchEnd: stop,
  };
};