import { useEffect, useRef, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent } from 'react';
import { usePersistentState } from './usePersistentState';

export interface ColumnLimits {
  /**
   * `px`: the left column's width in pixels; `max` is a share of the container.
   * `fraction`: the left column's share of the container (0–1), which survives window resizes.
   */
  unit: 'px' | 'fraction';
  min: number;
  max: number;
}

const STEP = { px: 24, fraction: 0.04 };

/** Keeps a column size within its limits; anything unreadable falls back to `fallback`. */
export function clampColumn(value: unknown, containerPx: number, { unit, min, max }: ColumnLimits, fallback: number): number {
  const n = typeof value === 'number' && Number.isFinite(value) ? value : fallback;
  if (unit === 'fraction') return Math.min(Math.max(n, min), max);
  // A container narrower than the minimum still gets the minimum.
  return Math.round(Math.min(Math.max(n, min), Math.max(min, containerPx * max)));
}

/**
 * The size of the column to the left of a vertical drag handle. The handle must be a
 * direct child of the container it divides; sizes are measured from the
 * container's left edge. Arrow keys nudge it, and `reset` restores the default.
 */
export function useColumnResize(storageKey: string, initial: number, limits: ColumnLimits) {
  const [stored, setStored] = usePersistentState<number>(storageKey, initial);
  const stopDrag = useRef<(() => void) | null>(null);
  const value = clampColumn(stored, Number.POSITIVE_INFINITY, limits, initial);

  useEffect(() => () => stopDrag.current?.(), []);

  const containerOf = (handle: HTMLElement) => (handle.parentElement as HTMLElement).getBoundingClientRect();
  const fromPointer = (box: DOMRect, clientX: number) =>
    limits.unit === 'fraction' ? (clientX - box.left) / box.width : clientX - box.left;

  const onPointerDown = (e: ReactPointerEvent<HTMLElement>) => {
    e.preventDefault();
    const box = containerOf(e.currentTarget);
    // Iframes (the preview) would swallow pointer events mid-drag.
    document.body.classList.add('is-resizing');
    const onMove = (ev: PointerEvent) => setStored(clampColumn(fromPointer(box, ev.clientX), box.width, limits, initial));
    const onUp = () => {
      document.body.classList.remove('is-resizing');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      stopDrag.current = null;
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    stopDrag.current = onUp;
  };

  const onKeyDown = (e: ReactKeyboardEvent<HTMLElement>) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const box = containerOf(e.currentTarget);
    const delta = (e.key === 'ArrowLeft' ? -1 : 1) * STEP[limits.unit];
    setStored((v) => clampColumn(clampColumn(v, box.width, limits, initial) + delta, box.width, limits, initial));
  };

  const reset = () => setStored(initial);

  return { value, onPointerDown, onKeyDown, reset };
}
