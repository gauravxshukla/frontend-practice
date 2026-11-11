import { describe, expect, it } from 'vitest';
import type { PaletteItem, PaletteKind } from '../../../src/features/palette/paletteIndex';
import { fuzzyRanges, rankItems, toSections } from '../../../src/features/palette/rank';

let n = 0;
const item = (title: string, over: Partial<PaletteItem> = {}): PaletteItem => ({
  id: `x:${n++}`,
  kind: 'question',
  title,
  keywords: [],
  ...over,
});
const titles = (query: string, items: PaletteItem[]) => rankItems(query, items).map((h) => h.item.title);

describe('rankItems', () => {
  it('orders title matches: exact > prefix > word start > substring > keyword > subtitle > fuzzy', () => {
    const items = [
      item('Xcaxcxhxe'), // fuzzy
      item('Zebra', { subtitle: 'cache layer' }), // subtitle
      item('Yak', { keywords: ['cache'] }), // keyword
      item('Mycache'), // substring
      item('LRU Cache'), // word start
      item('Cache Me'), // prefix
      item('Cache'), // exact
    ];
    const ranked = rankItems('cache', items, { perGroup: 10 }).map((h) => h.item.title);
    expect(ranked).toEqual(['Cache', 'Cache Me', 'LRU Cache', 'Mycache', 'Yak', 'Zebra', 'Xcaxcxhxe']);
  });

  it('requires every token to match (AND), across title, keywords and subtitle', () => {
    const items = [
      item('Two Sum', { keywords: ['array', 'easy'] }),
      item('Three Sum', { keywords: ['array', 'medium'] }),
      item('Sum of Squares', { keywords: ['math', 'easy'] }),
    ];
    // Prefix (80) beats word start (60); both also match the `easy` keyword.
    expect(titles('sum easy', items)).toEqual(['Sum of Squares', 'Two Sum']);
    expect(titles('sum array medium', items)).toEqual(['Three Sum']);
    expect(titles('sum graph', items)).toEqual([]);
  });

  it('matches fuzzily, in order, and reports merged highlight ranges', () => {
    expect(fuzzyRanges('twsm', 'two sum')).toEqual([[0, 2], [4, 5], [6, 7]]);
    expect(fuzzyRanges('xyz', 'two sum')).toBeNull();
    const [hit] = rankItems('twsm', [item('Two Sum')]);
    expect(hit.ranges).toEqual([[0, 2], [4, 5], [6, 7]]);
  });

  it('highlights in mixed case and unicode titles', () => {
    expect(rankItems('lru', [item('LRU Cache')])[0].ranges).toEqual([[0, 3]]);
    expect(rankItems('jà', [item('Déjà Vu')])[0].ranges).toEqual([[2, 4]]);
    expect(rankItems('vu dé', [item('Déjà Vu')])[0].ranges).toEqual([[0, 2], [5, 7]]);
  });

  it('returns nothing for an empty or blank query', () => {
    expect(rankItems('', [item('A')])).toEqual([]);
    expect(rankItems('   ', [item('A')])).toEqual([]);
  });

  it('searches only actions after ">" (all of them for a bare ">")', () => {
    const items = [item('Toggle theme', { kind: 'action' }), item('Theme parks'), item('Go home', { kind: 'action' })];
    expect(titles('>theme', items)).toEqual(['Toggle theme']);
    expect(titles('>', items)).toEqual(['Toggle theme', 'Go home']);
  });

  it('caps each group and the total, keeping group order', () => {
    const kinds: PaletteKind[] = ['question', 'topic', 'deck', 'note', 'action', 'question'];
    const items = Array.from({ length: 60 }, (_, i) => item(`Graph ${i}`, { kind: kinds[i % kinds.length] }));
    const hits = rankItems('graph', items);
    expect(hits).toHaveLength(30);
    const sections = toSections(hits);
    expect(sections.map((s) => s.id)).toEqual(['question', 'topic', 'deck', 'note', 'action']);
    sections.forEach((s) => expect(s.hits.length).toBeLessThanOrEqual(6));
    expect(rankItems('graph', items, { total: 10 })).toHaveLength(10);
  });

  it('applies the boost and prefers shorter titles on ties', () => {
    const a = item('Graph Clone');
    const b = item('Graph Valid Tree');
    expect(titles('graph', [b, a])).toEqual(['Graph Clone', 'Graph Valid Tree']);
    expect(rankItems('graph', [a, b], { boost: (i) => (i === b ? 3 : 0) })[0].item).toBe(b);
  });

  it('copes with a huge query', () => {
    expect(rankItems('a'.repeat(500), [item('Aardvark')])).toEqual([]);
  });
});
