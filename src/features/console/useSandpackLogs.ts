import { useCallback, useEffect, useRef, useState } from 'react';
import { useSandpack } from '@codesandbox/sandpack-react';
import { fromSandpackPayload, isClearPayload } from './fromSandpack';
import type { LogEntry } from './types';

/** Keeps the console bounded however chatty the preview gets. */
const MAX_LOGS = 1000;

/**
 * Console output of the current Sandpack preview as LogEntries; cleared when the
 * preview restarts. Listens to raw messages instead of useSandpackConsole because
 * that hook drops the referenced objects cyclic values need (see fromSandpack.ts).
 */
export function useSandpackLogs() {
  const { listen } = useSandpack();
  const [entries, setEntries] = useState<LogEntry[]>([]);
  // The same message can arrive more than once; ids are unique per console call.
  const seen = useRef(new Set<string>());

  const clear = useCallback(() => {
    seen.current = new Set();
    setEntries([]);
  }, []);

  useEffect(
    () =>
      listen((message) => {
        if (message.type === 'start') {
          clear();
          return;
        }
        if (message.type !== 'console' || !(message as { codesandbox?: boolean }).codesandbox) return;
        const entry = fromSandpackPayload(message.log);
        if (!entry || seen.current.has(entry.id)) return;
        seen.current.add(entry.id);
        if (isClearPayload(message.log)) {
          setEntries([entry]);
          return;
        }
        setEntries((prev) => (prev.length >= MAX_LOGS ? [...prev.slice(prev.length - MAX_LOGS + 1), entry] : [...prev, entry]));
      }),
    [listen, clear],
  );

  return { entries, clear };
}
