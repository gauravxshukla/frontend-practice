import { useCallback, useSyncExternalStore } from 'react';

/** Phones and portrait tablets: the drawer sidebar and stacked question page (keep in sync with the CSS). */
export const MOBILE_QUERY = '(max-width: 860px)';
/** A finger rather than a mouse: bigger text in fields (iOS zooms below 16px) and bigger hit areas. */
export const COARSE_POINTER_QUERY = '(pointer: coarse)';

/** Calls `onChange` whenever `query` starts or stops matching; returns the unsubscribe. */
export function subscribeQuery(query: string, onChange: () => void, matchMedia = window.matchMedia.bind(window)): () => void {
  const list = matchMedia(query);
  list.addEventListener('change', onChange);
  return () => list.removeEventListener('change', onChange);
}

/** Whether `query` matches now, re-rendering when that changes (rotation, window resize). */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback((onChange: () => void) => subscribeQuery(query, onChange), [query]);
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
