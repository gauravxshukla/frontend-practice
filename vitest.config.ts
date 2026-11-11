import { existsSync, globSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { defineConfig } from 'vitest/config';

// JS questions: Jest-style suites run against the reference solution.
// Prompt-only questions (tests but no solution.js yet) are skipped.
const jsSuites = globSync('content/**/solution.test.js').filter((test) =>
  existsSync(join(dirname(test), 'solution.js')),
);

export default defineConfig({
  test: {
    // Every app test lives under test/, mirroring src/ (see CLAUDE.md). test/content/ verifies
    // the question content: DSA cases.json, JS suites under mini-Jest, Python and Java.
    // The content's own solution.test.js suites stay with their question (the app runs them).
    include: [...jsSuites, 'test/**/*.test.{js,ts}'],
    setupFiles: ['test/setup.js'],
    globals: true,
    environment: 'node',
  },
});
