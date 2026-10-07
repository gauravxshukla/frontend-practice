import type { CaseResult, RunResponse } from './runJob';

export type VerdictKind = 'accepted' | 'wrong' | 'runtime' | 'compile' | 'tle' | 'finished' | 'internal';

export interface Verdict {
  kind: VerdictKind;
  title: string;
  /** "3 / 8 testcases passed", "Runtime 4 ms", … */
  detail?: string;
  message?: string;
  results: CaseResult[];
  /** First case that didn't pass, for Submit's "last executed input". */
  firstFailure?: CaseResult;
}

export const VERDICT_TITLES: Record<VerdictKind, string> = {
  accepted: 'Accepted',
  wrong: 'Wrong Answer',
  runtime: 'Runtime Error',
  compile: 'Compile Error',
  tle: 'Time Limit Exceeded',
  finished: 'Finished',
  internal: 'Runner Error',
};

export function toVerdict(response: RunResponse): Verdict {
  switch (response.type) {
    case 'compile-error': {
      // Errors thrown while the module loads (outside a function) aren't syntax errors.
      const kind = response.message.startsWith('SyntaxError') ? 'compile' : 'runtime';
      return { kind, title: VERDICT_TITLES[kind], message: response.message, results: [] };
    }
    case 'timeout':
      return {
        kind: 'tle',
        title: VERDICT_TITLES.tle,
        message: `Your code ran for more than ${response.limitMs / 1000}s and was stopped. Look for an infinite loop, or a slower-than-expected path on large input.`,
        results: [],
      };
    case 'internal-error':
      return { kind: 'internal', title: VERDICT_TITLES.internal, message: response.message, results: [] };
    case 'collected':
      return { kind: 'internal', title: VERDICT_TITLES.internal, message: 'Unexpected response.', results: [] };
    case 'done': {
      const { results, runtimeMs } = response;
      const graded = results.filter((r) => r.passed !== null);
      const passed = graded.filter((r) => r.passed).length;
      const firstFailure = results.find((r) => r.passed === false);
      const detail = graded.length ? `${passed} / ${graded.length} testcases passed · ${runtimeMs} ms` : `${runtimeMs} ms`;
      if (!graded.length) return { kind: 'finished', title: VERDICT_TITLES.finished, detail, results };
      const kind: VerdictKind = !firstFailure ? 'accepted' : firstFailure.error ? 'runtime' : 'wrong';
      return { kind, title: VERDICT_TITLES[kind], detail, results, firstFailure, message: firstFailure?.error?.message };
    }
  }
}
