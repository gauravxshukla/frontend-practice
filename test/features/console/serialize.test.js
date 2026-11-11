import { describe, expect, it } from 'vitest';
import { MAX_DEPTH, MAX_ITEMS, serializeValue } from '../../../src/features/console/serialize.js';

describe('serializeValue', () => {
  it('serializes primitives', () => {
    expect(serializeValue('hi')).toEqual({ t: 'prim', type: 'string', v: 'hi' });
    expect(serializeValue(-0)).toEqual({ t: 'prim', type: 'number', v: '-0' });
    expect(serializeValue(NaN)).toEqual({ t: 'prim', type: 'number', v: 'NaN' });
    expect(serializeValue(10n)).toEqual({ t: 'prim', type: 'bigint', v: '10n' });
    expect(serializeValue(undefined)).toEqual({ t: 'prim', type: 'undefined', v: 'undefined' });
    expect(serializeValue(null)).toEqual({ t: 'prim', type: 'null', v: 'null' });
    expect(serializeValue(Symbol('s'))).toEqual({ t: 'prim', type: 'symbol', v: 'Symbol(s)' });
  });

  it('serializes nested objects, arrays and class instances', () => {
    class Point {
      constructor() {
        this.x = 1;
      }
    }
    expect(serializeValue({ a: [1, { b: 'c' }], p: new Point() })).toEqual({
      t: 'object',
      entries: [
        [
          'a',
          {
            t: 'array',
            len: 2,
            items: [
              { t: 'prim', type: 'number', v: '1' },
              { t: 'object', entries: [['b', { t: 'prim', type: 'string', v: 'c' }]] },
            ],
          },
        ],
        ['p', { t: 'object', ctor: 'Point', entries: [['x', { t: 'prim', type: 'number', v: '1' }]] }],
      ],
    });
  });

  it('marks cycles but serializes shared references in full', () => {
    const node = { val: 1 };
    node.next = node;
    expect(serializeValue(node)).toEqual({
      t: 'object',
      entries: [
        ['val', { t: 'prim', type: 'number', v: '1' }],
        ['next', { t: 'circular' }],
      ],
    });
    const shared = { v: 1 };
    const both = serializeValue([shared, shared]);
    expect(both.items[1]).toEqual(both.items[0]);
  });

  it('serializes Map, Set, functions, classes, errors, dates and sparse arrays', () => {
    expect(serializeValue(new Map([['k', 1]]))).toEqual({
      t: 'map',
      size: 1,
      entries: [[{ t: 'prim', type: 'string', v: 'k' }, { t: 'prim', type: 'number', v: '1' }]],
    });
    expect(serializeValue(new Set([1]))).toEqual({ t: 'set', size: 1, items: [{ t: 'prim', type: 'number', v: '1' }] });
    expect(serializeValue(function twoSum() {})).toEqual({ t: 'fn', name: 'twoSum', isClass: false });
    expect(serializeValue(class Foo {})).toEqual({ t: 'fn', name: 'Foo', isClass: true });
    expect(serializeValue(new TypeError('bad'))).toMatchObject({ t: 'error', name: 'TypeError', message: 'bad' });
    expect(serializeValue(new Date(0))).toEqual({ t: 'special', v: '1970-01-01T00:00:00.000Z' });
    // eslint-disable-next-line no-sparse-arrays
    expect(serializeValue([1, , 3]).items[1]).toEqual({ t: 'special', v: '<empty>' });
    expect(serializeValue(new Int8Array([1, 2]))).toMatchObject({ t: 'array', ctor: 'Int8Array', len: 2 });
  });

  it('serializes DOM elements as tags', () => {
    const el = document.createElement('div');
    el.setAttribute('id', 'app');
    expect(serializeValue(el)).toEqual({ t: 'dom', tag: 'div', attrs: 'id="app"' });
  });

  it('caps items per level and depth', () => {
    const big = serializeValue(Array.from({ length: MAX_ITEMS + 5 }, (_, i) => i));
    expect(big.items).toHaveLength(MAX_ITEMS);
    expect(big.more).toBe(5);

    let deep = { leaf: true };
    for (let i = 0; i < MAX_DEPTH + 2; i++) deep = { child: deep };
    let v = serializeValue(deep);
    for (let i = 0; i < MAX_DEPTH; i++) v = v.entries[0][1];
    expect(v).toEqual({ t: 'special', v: '{…}' });
  });

  it('survives throwing getters and structured clone', () => {
    const obj = {
      get boom() {
        throw new Error('nope');
      },
    };
    const out = serializeValue(obj);
    expect(out.entries[0]).toEqual(['boom', { t: 'special', v: '[Getter threw]' }]);
    expect(structuredClone(serializeValue({ a: [new Map([[1, new Set([2])]])] }))).toBeTruthy();
  });
});
