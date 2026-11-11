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
    // DSA questions are data-driven (cases.json) and graded by scripts/verify-dsa.test.js.
    // App unit tests live next to their code under src/.
    include: [...jsSuites, 'scripts/verify-dsa.test.js', 'scripts/verify-js-minijest.test.js', 'scripts/verify-python.test.js', 'scripts/verify-java.test.js', 'src/**/*.test.{js,ts}'],
    setupFiles: ['scripts/vitest-setup.js'],
    globals: true,
    environment: 'node',
  },
});
