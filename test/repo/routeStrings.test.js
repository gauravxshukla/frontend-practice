import { globSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// App URLs are built by src/lib/routes.ts; a hand-written old-style path would bypass it.
describe('route strings', () => {
  it('has no hard-coded /q/ or /topics/ paths outside src/lib/routes.ts', () => {
    const offenders = globSync('src/**/*.{ts,tsx}')
      .filter((file) => file !== 'src/lib/routes.ts')
      .flatMap((file) =>
        readFileSync(file, 'utf8')
          .split('\n')
          .flatMap((line, i) => {
            const isComment = /^\s*(\/\/|\/\*|\*)/.test(line);
            return !isComment && /['"`]\/(q|topics)\//.test(line) ? [`${file}:${i + 1}  ${line.trim()}`] : [];
          }),
      );
    expect(offenders).toEqual([]);
  });
});
