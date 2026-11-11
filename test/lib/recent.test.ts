import { beforeEach, describe, expect, it } from 'vitest';
import { readRecent, recordVisit } from '../../src/lib/recent';

const store = new Map<string, string>();
globalThis.localStorage = {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => void store.set(k, v),
  removeItem: (k: string) => void store.delete(k),
  clear: () => store.clear(),
  key: () => null,
  length: 0,
} as Storage;

describe('recent', () => {
  beforeEach(() => store.clear());

  it('records newest first and moves a revisit to the front', () => {
    recordVisit('/q/a');
    recordVisit('/q/b');
    recordVisit('/q/a');
    expect(readRecent()).toEqual(['/q/a', '/q/b']);
  });

  it('keeps at most 8 and ignores the home page', () => {
    for (let i = 0; i < 12; i++) recordVisit(`/q/${i}`);
    recordVisit('/');
    expect(readRecent()).toHaveLength(8);
    expect(readRecent()[0]).toBe('/q/11');
  });

  it('maps visits saved under the old URLs to the new ones', () => {
    store.set('fp:recent', JSON.stringify(['/q/dsa/arrays-hashing/two-sum', '/dsa/two-sum', '/topics/dsa/trees']));
    expect(readRecent()).toEqual(['/dsa/two-sum', '/dsa/topics/trees']);
  });

  it('treats corrupt storage as empty', () => {
    store.set('fp:recent', '{nope');
    expect(readRecent()).toEqual([]);
    store.set('fp:recent', '{"a":1}');
    expect(readRecent()).toEqual([]);
  });
});
