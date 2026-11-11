import { pythonRuntime } from '../python/pythonRuntime';
import { jsRuntime } from './jsRuntime';
import type { LanguageId, LanguageRuntime } from './types';

export interface LanguageInfo {
  id: LanguageId;
  label: string;
  /** Sandbox path of the user's solution in this language. */
  file: string;
  /** Run limit; Python is several times slower than JS. */
  limitMs: number;
  /** Approximate one-time download, shown while the runtime loads. */
  download?: string;
}

/** Languages offered for DSA questions, in menu order. */
export const LANGUAGES: LanguageInfo[] = [
  { id: 'javascript', label: 'JavaScript', file: '/solution.js', limitMs: 3000 },
  { id: 'python', label: 'Python', file: '/solution.py', limitMs: 8000, download: '~6 MB' },
];

const RUNTIMES: Record<LanguageId, LanguageRuntime> = {
  javascript: jsRuntime,
  python: pythonRuntime,
};

export const languageInfo = (id: LanguageId) => LANGUAGES.find((l) => l.id === id) ?? LANGUAGES[0];

export const isLanguageId = (value: unknown): value is LanguageId => LANGUAGES.some((l) => l.id === value);

/** Runtimes are cheap to create; the heavy part (Pyodide) only downloads on warmUp(). */
export const getRuntime = (id: LanguageId) => RUNTIMES[id];
