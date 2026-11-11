import { beforeEach, describe, expect, it, vi } from 'vitest';

const store = new Map<string, string>();
globalThis.localStorage = {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => void store.set(k, v),
  removeItem: (k: string) => void store.delete(k),
  clear: () => store.clear(),
  key: () => null,
  length: 0,
} as Storage;

// The store keeps a module-level copy; each test loads it afresh.
const load = async () => {
  vi.resetModules();
  return import('../../src/lib/activity');
};
const saved = () => JSON.parse(store.get('fp:activity')!);

describe('activity', () => {
  beforeEach(() => store.clear());

  it('counts sessions per local day and remembers when each question was touched', async () => {
    const { recordActivity } = await load();
    const morning = new Date(2026, 10, 11, 9).getTime();
    recordActivity('dsa/a', morning);
    recordActivity('dsa/b', morning + 1000);
    recordActivity('dsa/a', new Date(2026, 10, 12, 0, 5).getTime());
    expect(saved().days).toEqual({ '2026-11-11': 2, '2026-11-12': 1 });
    expect(saved().touched['dsa/b']).toBe(morning + 1000);
  });

  it('sets `since` once, when recording starts', async () => {
    let { recordActivity } = await load();
    recordActivity('x');
    const since = saved().since;
    store.set('fp:activity', JSON.stringify({ ...saved(), since: '2020-01-01' }));
    ({ recordActivity } = await load());
    recordActivity('y');
    expect(saved().since).toBe('2020-01-01');
    expect(since).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('starts over when storage is corrupt', async () => {
    store.set('fp:activity', '{oops');
    const { recordActivity } = await load();
    recordActivity('z', new Date(2026, 0, 1).getTime());
    expect(saved().days).toEqual({ '2026-01-01': 1 });
  });
});
