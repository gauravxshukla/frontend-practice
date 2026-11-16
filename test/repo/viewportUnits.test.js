import { globSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// On mobile Safari `100vh` is the viewport with the toolbar hidden, so a full-height
// layout loses its bottom row (Run / Submit) behind the toolbar. Any height in `vh`
// must be followed by the same declaration in `dvh`, which tracks the visible viewport;
// the `vh` line stays as the fallback for browsers without `dvh`.
const VH_HEIGHT = /^\s*((?:min-|max-)?height)\s*:[^;]*\d+vh\b/;
const withoutComments = (line) => line.replace(/\/\*.*?\*\//g, '');

describe('viewport units', () => {
  it('pairs every vh height with a dvh one', () => {
    const offenders = globSync('src/**/*.css').flatMap((file) => {
      const lines = readFileSync(file, 'utf8').split('\n').map(withoutComments);
      return lines.flatMap((line, i) => {
        const match = VH_HEIGHT.exec(line);
        if (!match) return [];
        const next = lines.slice(i + 1).find((l) => l.trim()) ?? '';
        const paired = next.trim().startsWith(`${match[1]}:`) && /\d+dvh\b/.test(next);
        return paired ? [] : [`${file}:${i + 1}  ${line.trim()}`];
      });
    });
    expect(offenders).toEqual([]);
  });
});
