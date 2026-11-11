import type { LogEntry } from './types';

/**
 * Collapses identical consecutive logs into one row with a count, like DevTools.
 * A log inside a loop then reads as `value ×100` instead of a wall of lines.
 */
export function groupRepeats(entries: LogEntry[]): LogEntry[] {
  const out: LogEntry[] = [];
  let lastKey = '';
  for (const entry of entries) {
    const key = `${entry.level}\u0000${JSON.stringify(entry.args)}`;
    const last = out[out.length - 1];
    if (last && key === lastKey) {
      out[out.length - 1] = { ...last, count: last.count + entry.count };
    } else {
      out.push(entry);
      lastKey = key;
    }
  }
  return out;
}
