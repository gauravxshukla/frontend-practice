import { describe, expect, it } from 'vitest';
import { emptyLogState, MAX_LOGS, reduceSandpackMessage, type SandpackMessage } from '../../../src/features/console/sandpackLogState';

const log = (id: string, method = 'log'): SandpackMessage => ({
  type: 'console',
  codesandbox: true,
  log: [{ method, id, data: [`message ${id}`] }],
});
const start = (firstLoad: boolean): SandpackMessage => ({ type: 'start', codesandbox: true, firstLoad });
const run = (...messages: SandpackMessage[]) => messages.reduce(reduceSandpackMessage, emptyLogState());
const ids = (...messages: SandpackMessage[]) => run(...messages).entries.map((e) => e.id);

describe('reduceSandpackMessage', () => {
  it('collects console calls in order and ignores duplicates and other messages', () => {
    expect(ids(start(true), log('a'), log('b'), log('a'), { type: 'done' }, { type: 'console', log: [] })).toEqual(['a', 'b']);
  });

  it('starts empty on a first load', () => {
    expect(ids(log('old'), start(true), log('a'))).toEqual(['a']);
  });

  // Reloading a page whose bundle is cached: Sandpack recompiles once more after the
  // first render without re-running the app. That must not wipe the first render's logs.
  it('keeps the logs when a recompile produces no new output', () => {
    expect(ids(start(true), log('a', 'error'), log('b'), start(false), { type: 'done' })).toEqual(['a', 'b']);
  });

  it('replaces the logs once a recompile logs again (an edit re-ran the app)', () => {
    expect(ids(start(true), log('a'), start(false), log('c'), log('d'))).toEqual(['c', 'd']);
  });

  it('honours console.clear()', () => {
    expect(ids(start(true), log('a'), log('x', 'clear'), log('b'))).toEqual(['x', 'b']);
  });

  it('drops the oldest entries past the cap', () => {
    const many = Array.from({ length: MAX_LOGS + 5 }, (_, i) => log(String(i)));
    const state = run(start(true), ...many);
    expect(state.entries).toHaveLength(MAX_LOGS);
    expect(state.entries[0].id).toBe('5');
  });
});
