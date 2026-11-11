// A logged value, flattened into plain JSON so it can cross postMessage (runner
// workers, the Sandpack iframe) and still be rendered as an expandable tree.
// Producers: serialize.js (live JS values), fromSandpack.ts (Sandpack's encoding),
// textLog() (plain stdout lines from other languages). Consumer: ConsoleView.

export type PrimType = 'string' | 'number' | 'boolean' | 'null' | 'undefined' | 'bigint' | 'symbol';

export type InspectValue =
  | { t: 'prim'; type: PrimType; v: string }
  /** `ctor` is set for typed arrays (`Int8Array`); `more` = items not captured. */
  | { t: 'array'; len: number; items: InspectValue[]; more?: number; ctor?: string }
  | { t: 'object'; ctor?: string; entries: [string, InspectValue][]; more?: number }
  | { t: 'map'; size: number; entries: [InspectValue, InspectValue][]; more?: number }
  | { t: 'set'; size: number; items: InspectValue[]; more?: number }
  | { t: 'fn'; name: string; isClass?: boolean }
  | { t: 'dom'; tag: string; attrs: string }
  | { t: 'error'; name: string; message: string; stack?: string }
  /** Anything shown verbatim without quotes: dates, regexps, `Promise {…}`, depth cut-offs. */
  | { t: 'special'; v: string }
  | { t: 'circular' }
  /** A raw stdout line (Python `print`, Java `System.out`). */
  | { t: 'text'; v: string };

export type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug';

export interface LogEntry {
  id: string;
  level: LogLevel;
  args: InspectValue[];
  /** How many identical consecutive logs this row stands for (see groupRepeats). */
  count: number;
}

export const LOG_LEVELS: readonly LogLevel[] = ['log', 'info', 'warn', 'error', 'debug'];

/** A plain text line as a log entry, for runtimes that only give us stdout text. */
export function textLog(id: string, level: LogLevel, line: string): LogEntry {
  return { id, level, args: [{ t: 'text', v: line }], count: 1 };
}
