import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Hover-to-open with intent: opens after `openDelay` (so passing over doesn't
 * flash a menu), switches instantly between items once one is open, and closes
 * `closeDelay` after leaving (time to cross a gap into the menu).
 */
export function useHoverIntent<T>(openDelay = 150, closeDelay = 250) {
  const [current, setCurrent] = useState<T | null>(null);
  const currentRef = useRef<T | null>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const set = useCallback((value: T | null) => {
    clearTimeout(openTimer.current);
    clearTimeout(closeTimer.current);
    currentRef.current = value;
    setCurrent(value);
  }, []);

  const enter = useCallback(
    (value: T) => {
      clearTimeout(openTimer.current);
      clearTimeout(closeTimer.current);
      if (currentRef.current !== null) set(value);
      else openTimer.current = setTimeout(() => set(value), openDelay);
    },
    [openDelay, set],
  );

  const leave = useCallback(() => {
    clearTimeout(openTimer.current);
    clearTimeout(closeTimer.current);
    if (currentRef.current !== null) closeTimer.current = setTimeout(() => set(null), closeDelay);
  }, [closeDelay, set]);

  const cancelClose = useCallback(() => clearTimeout(closeTimer.current), []);

  useEffect(
    () => () => {
      clearTimeout(openTimer.current);
      clearTimeout(closeTimer.current);
    },
    [],
  );

  return { current, enter, leave, cancelClose, set };
}
