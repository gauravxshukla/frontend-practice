import { describe, expect, it, vi } from 'vitest';
import { subscribeQuery } from '../../src/lib/useMediaQuery';

/** A matchMedia stand-in that records its listeners so a test can fire a change. */
function fakeMatchMedia() {
  const listeners = new Set<() => void>();
  const queries: string[] = [];
  const matchMedia = ((query: string) => {
    queries.push(query);
    return {
      addEventListener: (_type: string, fn: () => void) => listeners.add(fn),
      removeEventListener: (_type: string, fn: () => void) => listeners.delete(fn),
    };
  }) as unknown as typeof window.matchMedia;
  return { matchMedia, listeners, queries };
}

describe('subscribeQuery', () => {
  it('listens to the given query and calls back when it changes', () => {
    const mm = fakeMatchMedia();
    const onChange = vi.fn();
    subscribeQuery('(max-width: 860px)', onChange, mm.matchMedia);

    expect(mm.queries).toEqual(['(max-width: 860px)']);
    mm.listeners.forEach((fn) => fn());
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('removes its listener on unsubscribe', () => {
    const mm = fakeMatchMedia();
    const unsubscribe = subscribeQuery('(pointer: coarse)', () => {}, mm.matchMedia);
    expect(mm.listeners.size).toBe(1);
    unsubscribe();
    expect(mm.listeners.size).toBe(0);
  });
});
