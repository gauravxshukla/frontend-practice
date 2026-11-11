import { useEffect, useRef, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent } from 'react';
import { usePersistentState } from './usePersistentState';

const KEY_STEP = 24;

/**
 * Height of a bottom panel resized by a horizontal handle. The handle must be a
 * direct child of the column it divides: the panel's height is measured from the
 * bottom of that column, and both the panel and whatever sits above it keep at
 * least `min` px.
 */
export function useRowResize(storageKey: string, initial: number, min = 120) {
  const [height, setHeight] = usePersistentState(storageKey, initial);
  // Listeners of a drag still in progress, so unmounting mid-drag can remove them.
  const stopDrag = useRef<(() => void) | null>(null);

  useEffect(() => () => stopDrag.current?.(), []);

  const clampTo = (container: DOMRect, px: number) =>
    Math.round(Math.min(Math.max(px, min), Math.max(min, container.height - min)));

  const onPointerDown = (e: ReactPointerEvent<HTMLElement>) => {
    e.preventDefault();
    const container = (e.currentTarget.parentElement as HTMLElement).getBoundingClientRect();
    // Iframes (Sandpack preview) would swallow pointer events mid-drag.
    document.body.classList.add('is-resizing-rows');
    const onMove = (ev: PointerEvent) => setHeight(clampTo(container, container.bottom - ev.clientY));
    const onUp = () => {
      document.body.classList.remove('is-resizing-rows');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      stopDrag.current = null;
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    stopDrag.current = onUp;
  };

  const onKeyDown = (e: ReactKeyboardEvent<HTMLElement>) => {
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
    e.preventDefault();
    const container = (e.currentTarget.parentElement as HTMLElement).getBoundingClientRect();
    const delta = e.key === 'ArrowUp' ? KEY_STEP : -KEY_STEP;
    setHeight((h) => clampTo(container, h + delta));
  };

  return { height, onPointerDown, onKeyDown };
}
