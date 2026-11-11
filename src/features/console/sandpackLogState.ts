import { fromSandpackPayload, isClearPayload } from './fromSandpack';
import type { LogEntry } from './types';

/** Keeps the console bounded however chatty the preview gets. */
export const MAX_LOGS = 1000;

export interface LogState {
  entries: LogEntry[];
  /** The same message can arrive more than once; ids are unique per console call. */
  seen: Set<string>;
  /** A recompile started: the next console call replaces what's shown. */
  stale: boolean;
}

export const emptyLogState = (): LogState => ({ entries: [], seen: new Set(), stale: false });

/** The fields of a raw Sandpack client message this reducer reads. */
export interface SandpackMessage {
  type: string;
  codesandbox?: boolean;
  firstLoad?: boolean;
  log?: unknown;
}

/**
 * Applies one Sandpack message to the console's state (pure).
 *
 * A first load starts the console empty. A later recompile (`firstLoad: false`)
 * doesn't clear it straight away: when a cached bundle is reloaded, Sandpack
 * recompiles once more after the first render without re-running the app, and
 * clearing then would lose that render's logs. Instead the next console call
 * replaces them, which is what happens when an edit re-runs the app.
 */
export function reduceSandpackMessage(state: LogState, message: SandpackMessage): LogState {
  if (message.type === 'start') return message.firstLoad === false ? { ...state, stale: true } : emptyLogState();
  if (message.type !== 'console' || !message.codesandbox) return state;
  const entry = fromSandpackPayload(message.log);
  if (!entry) return state;
  const base = state.stale ? emptyLogState() : state;
  if (base.seen.has(entry.id)) return state;
  const seen = new Set(base.seen).add(entry.id);
  if (isClearPayload(message.log)) return { entries: [entry], seen, stale: false };
  const kept = base.entries.length >= MAX_LOGS ? base.entries.slice(base.entries.length - MAX_LOGS + 1) : base.entries;
  return { entries: [...kept, entry], seen, stale: false };
}
