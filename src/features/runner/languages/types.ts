import type { DsaCase, DsaSpec } from '../../../lib/content/catalog';
import type { LogEntry } from '../../console/types';
import type { RunResponse } from '../runJob';

export type LanguageId = 'javascript' | 'python' | 'java';

/** `cold` = not loaded yet; `restarting` = reloading after a timeout killed it. */
export type RuntimeStatus = 'cold' | 'loading' | 'ready' | 'error' | 'restarting';

/** What a non-JS runtime reports for one testcase; core.js then judges it. */
export interface ExecOutput {
  index: number;
  /** Comparable JSON, already converted the way core.js#fromOutput would. */
  output?: unknown;
  error?: { message: string; line: number | null };
  logs: LogEntry[];
}

export type ExecResult =
  | { type: 'outputs'; outputs: ExecOutput[]; runtimeMs: number }
  | Extract<RunResponse, { type: 'compile-error' | 'timeout' | 'internal-error' }>;

export interface DsaRunInput {
  code: string;
  spec: DsaSpec;
  cases: DsaCase[];
  /** JS reference solution: computes expected values for custom testcases in every language. */
  refCode?: string;
  checkerCode?: string;
}

export interface LanguageRuntime {
  id: LanguageId;
  status(): RuntimeStatus;
  /** Why the last load failed, for the error state. */
  error(): string | undefined;
  subscribe(onChange: () => void): () => void;
  /** Starts loading the runtime; resolves when it can run code. */
  warmUp(): Promise<void>;
  /** Runs and judges a DSA job. */
  run(input: DsaRunInput, limitMs: number): Promise<RunResponse>;
}
