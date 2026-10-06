import { useCallback, useState } from 'react';

// useState that survives reloads. Storage can be unavailable (private mode,
// blocked site data), so every access is guarded and falls back to memory.
function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function usePersistentState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => read(key, initial));

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof next === 'function' ? (next as (p: T) => T)(prev) : next;
        try {
          localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          // Keep the in-memory value only.
        }
        return resolved;
      });
    },
    [key],
  );

  return [value, update] as const;
}
