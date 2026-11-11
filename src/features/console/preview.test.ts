import { describe, expect, it } from 'vitest';
import { serializeValue } from './serialize.js';
import { entryText, isExpandable, previewOf } from './preview';
import { groupRepeats } from './groupRepeats';
import { textLog, type InspectValue, type LogEntry } from './types';

const s = (v: unknown) => serializeValue(v) as InspectValue;

describe('previewOf', () => {
  it('prints top-level strings raw and nested strings quoted', () => {
    expect(previewOf(s('hi'), 80, true)).toBe('hi');
    expect(previewOf(s(['hi']))).toBe('(1) ["hi"]');
  });

  it('summarises containers DevTools-style', () => {
    expect(previewOf(s([1, 2, 3]))).toBe('(3) [1, 2, 3]');
    expect(previewOf(s({ a: 1, b: { c: 2 }, d: [1] }))).toBe('{a: 1, b: {…}, d: Array(1)}');
    expect(previewOf(s(new Map([['a', 1]])))).toBe('Map(1) {"a" => 1}');
    expect(previewOf(s(new Set([1, 2])))).toBe('Set(2) {1, 2}');
    expect(previewOf(s(function go() {}))).toBe('ƒ go()');
    expect(previewOf(s(new Error('x')))).toBe('Error: x');
  });

  it('truncates long previews with an ellipsis', () => {
    const out = previewOf(s(Array.from({ length: 50 }, (_, i) => i)), 20);
    expect(out.startsWith('(50) [0, 1, 2')).toBe(true);
    expect(out.endsWith('…]')).toBe(true);
  });

  it('knows what can expand', () => {
    expect(isExpandable(s({ a: 1 }))).toBe(true);
    expect(isExpandable(s({}))).toBe(false);
    expect(isExpandable(s([]))).toBe(false);
    expect(isExpandable(s('x'))).toBe(false);
  });
});

describe('groupRepeats', () => {
  const log = (id: string, v: unknown, level: LogEntry['level'] = 'log'): LogEntry => ({
    id,
    level,
    args: [s(v)],
    count: 1,
  });

  it('collapses identical consecutive logs only', () => {
    const out = groupRepeats([log('1', 'a'), log('2', 'a'), log('3', 'b'), log('4', 'a'), log('5', 'a', 'warn')]);
    expect(out.map((e) => [e.id, e.count])).toEqual([
      ['1', 2],
      ['3', 1],
      ['4', 1],
      ['5', 1],
    ]);
  });

  it('builds filterable text for a log line', () => {
    expect(entryText({ id: '1', level: 'log', args: [s('sum'), s({ a: 1 })], count: 1 })).toBe('sum {a: 1}');
    expect(entryText(textLog('2', 'log', 'printed'))).toBe('printed');
  });
});
