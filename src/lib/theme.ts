import { useSyncExternalStore } from 'react';

export type ThemeMode = 'system' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';

const KEY = 'fp:theme';
const media = window.matchMedia('(prefers-color-scheme: dark)');
const listeners = new Set<() => void>();

function readMode(): ThemeMode {
  try {
    const stored = localStorage.getItem(KEY);
    return stored === 'light' || stored === 'dark' ? stored : 'system';
  } catch {
    return 'system';
  }
}

let mode: ThemeMode = readMode();

function resolve(): ResolvedTheme {
  return mode === 'system' ? (media.matches ? 'dark' : 'light') : mode;
}

function apply() {
  document.documentElement.dataset.theme = resolve();
  listeners.forEach((l) => l());
}

media.addEventListener('change', apply);
apply();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setThemeMode(next: ThemeMode) {
  mode = next;
  try {
    if (next === 'system') localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, next);
  } catch {
    // Theme just won't persist.
  }
  apply();
}

export function useTheme() {
  const current = useSyncExternalStore(subscribe, () => mode);
  const resolved = useSyncExternalStore(subscribe, resolve);
  return { mode: current, resolved, setMode: setThemeMode };
}
