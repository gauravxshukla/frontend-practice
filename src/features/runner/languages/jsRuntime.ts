import { runJob } from '../runJob';
import type { LanguageRuntime } from './types';

/** JavaScript keeps its original path: a fresh worker per run that executes and judges in one go. */
export const jsRuntime: LanguageRuntime = {
  id: 'javascript',
  status: () => 'ready',
  error: () => undefined,
  subscribe: () => () => {},
  warmUp: () => Promise.resolve(),
  run: ({ code, spec, cases, refCode, checkerCode }, limitMs) =>
    runJob({ type: 'dsa', userCode: code, refCode, checkerCode, spec, cases }, limitMs),
};
