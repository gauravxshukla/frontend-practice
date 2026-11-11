import { globSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// Tests live under test/, mirroring src/ (CLAUDE.md). The only tests elsewhere are
// the questions' own content/**/solution.test.js, which the app runs in the browser.
describe('test location', () => {
  it('has no test files under src/ or scripts/', () => {
    expect(globSync('{src,scripts}/**/*.{test,spec}.{js,jsx,ts,tsx,mjs,cjs}')).toEqual([]);
  });
});
