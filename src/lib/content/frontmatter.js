// Minimal frontmatter parser shared by the app and the Node scripts.
// Supports `key: value`, numbers, booleans, quoted strings and inline arrays `[a, b]`.

function parseValue(raw) {
  const v = raw.trim();
  if (v.startsWith('[') && v.endsWith(']')) {
    return v
      .slice(1, -1)
      .split(',')
      .map((item) => stripQuotes(item.trim()))
      .filter(Boolean);
  }
  if (v === 'true' || v === 'false') return v === 'true';
  if (v !== '' && !Number.isNaN(Number(v))) return Number(v);
  return stripQuotes(v);
}

function stripQuotes(v) {
  return /^(['"]).*\1$/.test(v) ? v.slice(1, -1) : v;
}

/** @returns {{ data: Record<string, any>, body: string }} */
export function parseFrontmatter(raw) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);
  if (!match) return { data: {}, body: raw };

  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const sep = line.indexOf(':');
    if (sep < 0) continue;
    data[line.slice(0, sep).trim()] = parseValue(line.slice(sep + 1));
  }
  return { data, body: raw.slice(match[0].length) };
}

export const QUESTION_TYPES = ['js', 'dsa', 'react', 'vanilla'];
export const DIFFICULTIES = ['easy', 'medium', 'hard'];

/** Which `type` a question folder must declare, based on where it lives. */
export function expectedTypeForSlug(slug) {
  if (slug.startsWith('js/')) return 'js';
  if (slug.startsWith('dsa/')) return 'dsa';
  if (slug.startsWith('machine-coding/react/')) return 'react';
  if (slug.startsWith('machine-coding/vanilla/')) return 'vanilla';
  return null;
}
