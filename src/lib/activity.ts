import { useSyncExternalStore } from 'react';
import { localDay, type DayCounts } from './stats';

// When you practised: sessions per local day (for the heatmap and streaks) and
// when each question was last touched (for "Continue"). Per browser, like
// progress; every storage access is guarded.

export interface Activity {
  v: 1;
  /** The day recording started: history before it is unknown, not empty. */
  since: string;
  days: DayCounts;
  touched: Record<string, number>;
}

const KEY = 'fp:activity';
const listeners = new Set<() => void>();

const isRecord = (v: unknown): v is Record<string, number> =>
  typeof v === 'object' && v !== null && !Array.isArray(v) && Object.values(v).every((n) => typeof n === 'number');

function read(): Activity {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(KEY) ?? 'null');
    const a = data as Partial<Activity> | null;
    if (a && a.v === 1 && typeof a.since === 'string' && isRecord(a.days) && isRecord(a.touched)) return a as Activity;
  } catch {
    // Unreadable: start again below.
  }
  const fresh: Activity = { v: 1, since: localDay(Date.now()), days: {}, touched: {} };
  save(fresh);
  return fresh;
}

function save(next: Activity) {
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Activity only lasts for this session.
  }
}

let state: Activity | null = null;
const current = () => (state ??= read());

/** A practice session on a question: Run, Submit, a first edit, or Mark complete. */
export function recordActivity(slug: string, now = Date.now()) {
  const prev = current();
  const day = localDay(now);
  state = { ...prev, days: { ...prev.days, [day]: (prev.days[day] ?? 0) + 1 }, touched: { ...prev.touched, [slug]: now } };
  save(state);
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useActivity(): Activity {
  return useSyncExternalStore(subscribe, current);
}
