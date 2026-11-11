// Guards the NeetCode 150 revision content: every problem's README `## Notes`
// is a list of bold labelled lines in a fixed order, and every problem has a
// JavaScript, Python and Java reference solution.
import { existsSync, globSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const LABELS = ['Identify', 'Key formula', 'Brute force', 'Better', 'Insight', 'Steps', 'Complexity', 'Pitfall', 'Related'];
const OPTIONAL = new Set(['Key formula', 'Better']);
const MAX_WORDS = 30;

const only = process.env.DSA_ONLY; // e.g. DSA_ONLY=content/dsa/trees

// Topics already rewritten in the revision format. The rest show as todo until
// they're converted; when every topic is listed this set (and the todo branch) goes away.
const CONVERTED = new Set([
  'arrays-hashing',
  'two-pointers',
  'sliding-window',
  'stack',
  'binary-search',
  'linked-list',
  'trees',
  'tries',
  'heap',
  'backtracking',
]);
const topicOf = (dir) => dir.split('/')[2];
const frontmatter = (raw) => Object.fromEntries(
  (/^---\n([\s\S]*?)\n---/.exec(raw)?.[1] ?? '')
    .split('\n')
    .map((line) => /^(\w+):\s*(.*)$/.exec(line))
    .filter(Boolean)
    .map((m) => [m[1], m[2].trim()]),
);

const problems = globSync('content/dsa/*/*/README.md')
  .sort()
  .map((path) => ({ path, raw: readFileSync(path, 'utf8') }))
  .map(({ path, raw }) => ({ path, dir: dirname(path), raw, meta: frontmatter(raw) }))
  .filter((p) => p.meta.neetcode === 'true');

const titles = problems.map((p) => p.meta.title.toLowerCase());
const isTitle = (name) => titles.some((t) => t.startsWith(name.toLowerCase()));

/** Splits "Pow(x, n), Two Sum II" into problem names, keeping commas that belong to a title. */
function relatedNames(text) {
  const parts = text.split(/,\s*/);
  const names = [];
  for (let i = 0; i < parts.length; ) {
    let j = parts.length;
    while (j > i + 1 && !isTitle(parts.slice(i, j).join(', '))) j--;
    names.push(parts.slice(i, j).join(', '));
    i = j;
  }
  return names;
}

test('finds the NeetCode 150', () => {
  if (!only) expect(problems).toHaveLength(150);
});

const selected = problems.filter((p) => !only || p.dir.startsWith(only));
for (const p of selected.filter((p) => !CONVERTED.has(topicOf(p.dir)))) {
  test.todo(`${p.dir}: revision notes and JS / Python / Java solutions`);
}

describe.each(selected.filter((p) => CONVERTED.has(topicOf(p.dir))).map((p) => [p.dir, p]))('%s', (_dir, p) => {
  const notes = p.raw.split(/^## Notes\s*$/m)[1]?.trim() ?? '';
  const lines = notes.split('\n').filter((l) => l.trim());

  test('notes are bold labelled lines in order, with no code blocks', () => {
    expect(notes, 'missing ## Notes').not.toBe('');
    expect(notes).not.toMatch(/```|~~~/);
    const labels = lines.map((line) => {
      const m = /^- \*\*([^*]+):\*\* (\S.*)$/.exec(line);
      expect(m, `not a "- **Label:** text" line: ${line}`).toBeTruthy();
      const words = m[2].split(/\s+/).length;
      expect(words, `${m[1]} has ${words} words`).toBeLessThanOrEqual(MAX_WORDS);
      return m[1];
    });
    const expected = LABELS.filter((l) => !OPTIONAL.has(l) || labels.includes(l));
    expect(labels).toEqual(expected);
  });

  test('related problems are NeetCode 150 questions', () => {
    const related = lines.find((l) => l.startsWith('- **Related:**'));
    const names = relatedNames(related.replace('- **Related:** ', ''));
    expect(names.length).toBeGreaterThanOrEqual(2);
    for (const name of names) expect(isTitle(name), `unknown problem "${name}"`).toBe(true);
  });

  test('has JavaScript, Python and Java solutions', () => {
    for (const file of ['solution.js', 'solution.py', 'solution.java']) {
      expect(existsSync(join(p.dir, file)), file).toBe(true);
    }
  });
});
