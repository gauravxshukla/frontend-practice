import { useEffect, useSyncExternalStore } from 'react';
import { getRuntime } from './registry';
import type { LanguageId } from './types';

/**
 * The runtime for `id` and its live status. Picking a language starts loading
 * it right away, so the download overlaps with reading the problem, not with Run.
 */
export function useLanguageRuntime(id: LanguageId) {
  const runtime = getRuntime(id);
  const status = useSyncExternalStore(runtime.subscribe, runtime.status);

  useEffect(() => {
    if (runtime.status() === 'cold') runtime.warmUp().catch(() => {});
  }, [runtime]);

  return { runtime, status, error: runtime.error() };
}
