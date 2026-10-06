import { existsSync, globSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { defineConfig } from 'vitest/config';

// Runs every reference solution against its own tests, so the answer key can't drift.
// Prompt-only questions (tests but no solution.js yet) are skipped.
const testFiles = globSync('content/**/solution.test.js').filter((test) =>
  existsSync(join(dirname(test), 'solution.js')),
);

export default defineConfig({
  test: {
    include: testFiles,
    globals: true,
    environment: 'node',
  },
});
