import { useSyncExternalStore } from 'react';

export type Status = 'solved' | 'attempted';

// Per-browser progress: a question becomes "attempted" on its first Run/Submit and
// "solved" on an Accepted submission (and stays solved). Storage access is guarded.
const KEY = 'fp:progress';
const listeners = new Set<() => void>();

function read(): Record<string, Status> {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}');
  } catch {
    return {};
  }
}

let state = read();

function write(next: Record<string, Status>) {
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Progress only lasts for this session.
  }
  listeners.forEach((l) => l());
}

export function markAttempted(slug: string) {
  if (!state[slug]) write({ ...state, [slug]: 'attempted' });
}

export function markSolved(slug: string) {
  if (state[slug] !== 'solved') write({ ...state, [slug]: 'solved' });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** The whole progress map; components derive counts from it. */
export function useProgress() {
  return useSyncExternalStore(subscribe, () => state);
}
