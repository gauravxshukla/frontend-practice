import type { PaletteItem, PaletteKind, PaletteSection } from './paletteIndex';

export type Range = [start: number, end: number];

export interface Hit {
  item: PaletteItem;
  score: number;
  /** Matched character ranges in the title, for highlighting. */
  ranges: Range[];
}

const GROUPS: { kind: PaletteKind; label: string }[] = [
  { kind: 'question', label: 'Questions' },
  { kind: 'topic', label: 'Topics' },
  { kind: 'deck', label: 'Quiz' },
  { kind: 'note', label: 'Notes' },
  { kind: 'action', label: 'Actions' },
];

const isWordStart = (text: string, i: number) => i === 0 || !/[\p{L}\p{N}]/u.test(text[i - 1]);

/** The token's characters in order inside `hay` (both lower-case), as merged ranges; null if absent. */
export function fuzzyRanges(needle: string, hay: string): Range[] | null {
  const ranges: Range[] = [];
  let from = 0;
  for (const ch of needle) {
    const at = hay.indexOf(ch, from);
    if (at < 0) return null;
    const last = ranges[ranges.length - 1];
    if (last && last[1] === at) last[1] = at + 1;
    else ranges.push([at, at + 1]);
    from = at + 1;
  }
  return ranges;
}

function scoreToken(token: string, item: PaletteItem, title: string): { score: number; ranges: Range[] } | null {
  const span = (at: number): Range[] => [[at, at + token.length]];
  if (title === token) return { score: 100, ranges: span(0) };
  if (title.startsWith(token)) return { score: 80, ranges: span(0) };
  let at = title.indexOf(token);
  const first = at;
  while (at > 0 && !isWordStart(title, at)) at = title.indexOf(token, at + 1);
  if (at > 0) return { score: 60, ranges: span(at) };
  if (first >= 0) return { score: 40, ranges: span(first) };
  if (item.keywords.some((k) => k.toLowerCase().includes(token))) return { score: 25, ranges: [] };
  if (item.subtitle?.toLowerCase().includes(token)) return { score: 15, ranges: [] };
  const fuzzy = token.length >= 2 ? fuzzyRanges(token, title) : null;
  return fuzzy ? { score: 10, ranges: fuzzy } : null;
}

function mergeRanges(ranges: Range[]): Range[] {
  const sorted = [...ranges].sort((a, b) => a[0] - b[0]);
  const out: Range[] = [];
  for (const r of sorted) {
    const last = out[out.length - 1];
    if (last && r[0] <= last[1]) last[1] = Math.max(last[1], r[1]);
    else out.push([...r]);
  }
  return out;
}

interface RankOptions {
  perGroup?: number;
  total?: number;
  /** Extra score, e.g. for questions you've started. */
  boost?: (item: PaletteItem) => number;
}

/**
 * Ranks items for a query: every whitespace-separated token must match the
 * title, a keyword or the subtitle (title matches score highest, a fuzzy
 * in-order match lowest). A leading `>` searches actions only. Results come back
 * grouped by kind, at most `perGroup` per group and `total` overall.
 */
export function rankItems(query: string, items: PaletteItem[], { perGroup = 6, total = 30, boost }: RankOptions = {}): Hit[] {
  const actionsOnly = query.trimStart().startsWith('>');
  const text = (actionsOnly ? query.trimStart().slice(1) : query).trim().toLowerCase();
  const tokens = text.split(/\s+/).filter(Boolean);
  if (!tokens.length && !actionsOnly) return [];

  const hits: (Hit & { order: number })[] = [];
  items.forEach((item, order) => {
    if (actionsOnly && item.kind !== 'action') return;
    const title = item.title.toLowerCase();
    let score = 0;
    const ranges: Range[] = [];
    for (const token of tokens) {
      const match = scoreToken(token, item, title);
      if (!match) return;
      score += match.score;
      ranges.push(...match.ranges);
    }
    if (item.kind === 'topic' && tokens.length === 1 && tokens[0].length <= 4) score += 2;
    score += boost?.(item) ?? 0;
    // Lower-casing can change length for a few characters; never highlight past the end.
    const safe = mergeRanges(ranges).filter(([, end]) => end <= item.title.length);
    hits.push({ item, score, ranges: safe, order });
  });

  // A bare `>` lists actions in their given order.
  if (tokens.length) hits.sort((a, b) => b.score - a.score || a.item.title.length - b.item.title.length || a.order - b.order);

  const grouped: Hit[] = [];
  for (const { kind } of GROUPS) {
    grouped.push(
      ...hits
        .filter((h) => h.item.kind === kind)
        .slice(0, perGroup)
        .map(({ item, score, ranges }) => ({ item, score, ranges })),
    );
  }
  // The cap drops the weakest hits, but keeps the group order.
  if (grouped.length <= total) return grouped;
  const keep = new Set([...grouped].sort((a, b) => b.score - a.score).slice(0, total));
  return grouped.filter((h) => keep.has(h));
}

/** Hits as labelled sections, in group order. */
export function toSections(hits: Hit[]): (PaletteSection & { hits: Hit[] })[] {
  return GROUPS.map(({ kind, label }) => {
    const inGroup = hits.filter((h) => h.item.kind === kind);
    return { id: kind, label, items: inGroup.map((h) => h.item), hits: inGroup };
  }).filter((s) => s.hits.length > 0);
}
