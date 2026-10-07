import deepMerge from './solution.js';

describe('deepMerge', () => {
  test('example: merges nested objects and concatenates arrays', () => {
    expect(deepMerge({ a: 1, b: { x: 1, y: [1] } }, { b: { y: [2], z: 3 }, c: 4 })).toEqual({
      a: 1,
      b: { x: 1, y: [1, 2], z: 3 },
      c: 4,
    });
  });

  test('example: undefined does not overwrite, null does', () => {
    expect(deepMerge({ a: 1 }, { a: undefined })).toEqual({ a: 1 });
    expect(deepMerge({ a: { b: 1 } }, { a: null })).toEqual({ a: null });
  });

  test('source primitives overwrite at any depth', () => {
    expect(deepMerge({ a: { b: { c: 1, d: 2 } } }, { a: { b: { c: 'x' } } })).toEqual({ a: { b: { c: 'x', d: 2 } } });
    expect(deepMerge({ a: 0 }, { a: false })).toEqual({ a: false });
  });

  test('type mismatches: source wins', () => {
    expect(deepMerge({ a: [1, 2] }, { a: { x: 1 } })).toEqual({ a: { x: 1 } });
    expect(deepMerge({ a: { x: 1 } }, { a: [1] })).toEqual({ a: [1] });
    expect(deepMerge({ a: 5 }, { a: { x: 1 } })).toEqual({ a: { x: 1 } });
  });

  test('a nested undefined does not overwrite and is not added', () => {
    const result = deepMerge({ a: { b: 1 } }, { a: { b: undefined, c: undefined } });
    expect(result).toEqual({ a: { b: 1 } });
    expect(Object.keys(result.a)).toEqual(['b']);
  });

  test('non-plain objects like Date overwrite by reference', () => {
    const date = new Date(0);
    const result = deepMerge({ when: { day: 1 } }, { when: date });
    expect(result.when).toBe(date);
  });

  test('returns a new object and does not mutate either input', () => {
    const target = { a: { b: [1] }, keep: { k: 1 } };
    const source = { a: { b: [2], c: { d: 1 } } };
    const result = deepMerge(target, source);
    expect(result).not.toBe(target);
    expect(target).toEqual({ a: { b: [1] }, keep: { k: 1 } });
    expect(source).toEqual({ a: { b: [2], c: { d: 1 } } });
  });

  test('the result shares no objects or arrays with the inputs', () => {
    const target = { only: { t: [1] }, both: { x: 1 } };
    const source = { extra: { s: [2] }, both: { y: 2 } };
    const result = deepMerge(target, source);
    result.only.t.push(99);
    result.extra.s.push(99);
    result.both.x = 99;
    expect(target).toEqual({ only: { t: [1] }, both: { x: 1 } });
    expect(source).toEqual({ extra: { s: [2] }, both: { y: 2 } });
  });

  test('empty inputs', () => {
    expect(deepMerge({}, {})).toEqual({});
    expect(deepMerge({ a: 1 }, {})).toEqual({ a: 1 });
    expect(deepMerge({}, { a: [1] })).toEqual({ a: [1] });
  });

  test('ignores __proto__ keys and does not pollute Object.prototype', () => {
    try {
      const result = deepMerge({}, JSON.parse('{"__proto__":{"polluted":1}}'));
      expect({}.polluted).toBeUndefined();
      expect(Object.prototype.polluted).toBeUndefined();
      expect(result.polluted).toBeUndefined();
      expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
    } finally {
      delete Object.prototype.polluted;
    }
  });

  test('nested __proto__ keys are ignored too', () => {
    try {
      const result = deepMerge({ a: {} }, JSON.parse('{"a":{"__proto__":{"polluted":1}},"b":1}'));
      expect({}.polluted).toBeUndefined();
      expect(result.a.polluted).toBeUndefined();
      expect(result.b).toBe(1);
    } finally {
      delete Object.prototype.polluted;
    }
  });
});
