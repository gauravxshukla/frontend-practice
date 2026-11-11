import { globSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// Colours are tokens defined for both themes in src/index.css. A literal anywhere
// else is how a toast ended up light in dark mode, so they're not allowed.
const LITERAL = /#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?)\(/i;
const withoutComments = (line) => line.replace(/\/\*.*?\*\//g, '');

describe('colour tokens', () => {
  it('has no colour literals in stylesheets other than src/index.css', () => {
    const offenders = globSync('src/**/*.css')
      .filter((file) => file !== 'src/index.css')
      .flatMap((file) =>
        readFileSync(file, 'utf8')
          .split('\n')
          .flatMap((line, i) => (LITERAL.test(withoutComments(line)) ? [`${file}:${i + 1}  ${line.trim()}`] : [])),
      );
    expect(offenders).toEqual([]);
  });
});
