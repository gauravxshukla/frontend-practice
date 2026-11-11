import { describe, expect, it } from 'vitest';
import { decodeSandpackValue, fromSandpackPayload, isClearPayload } from './fromSandpack';

// `log` payloads captured from a real Sandpack preview (react template, runtime
// bundler 2.19.8) by listening to the iframe's `console` messages; ids shortened
// and stacks trimmed. If a Sandpack upgrade changes the wire format, recapture these.
const fixtures = {
  primitives: [
    {
      method: 'log',
      id: 'p1',
      data: [
        'hello',
        42,
        true,
        null,
        { '@t': '[[undefined]]', data: '' },
        { '@t': '[[NaN]]', data: '' },
        { '@t': 'Arithmetic', data: 0 },
        { '@t': 'Arithmetic', data: 2 },
      ],
    },
  ],
  nested: [{ method: 'log', id: 'n1', data: [{ a: 1, nested: { b: [1, 2, { c: 'd' }] } }] }],
  // console.log(new Map([['k', { deep: true }]]), new Set([1, 2]))
  mapAndSet: [
    {
      method: 'log',
      id: 'm1',
      data: [
        { '@t': '[[Map]]', data: ['k', { deep: true }] },
        { '@t': '[[Set]]', data: [1, 2] },
      ],
    },
  ],
  // console.log(function named() {}, new Date(0), /x/g, document.createElement('div'))
  fnDateRegexpDom: [
    {
      method: 'log',
      id: 'f1',
      data: [
        { '@t': 'Function', data: { name: 'named', body: '', proto: 'Function' } },
        { '@t': '[[Date]]', data: 0 },
        { '@t': '[[RegExp]]', data: { src: 'x', flags: 'g' } },
        { '@t': 'HTMLElement', data: { tagName: 'div', attributes: {}, innerHTML: '' } },
      ],
    },
  ],
  // const cyc = { name: 'root' }; cyc.self = cyc; console.log(cyc)
  circular: [
    { method: 'log', id: 'c1', data: [{ '@r': 1 }] },
    { name: 'root', self: { '@r': 1 } },
  ],
  // const shared = { s: 1 }; console.log([shared, shared])
  shared: [{ method: 'log', id: 's1', data: [[{ '@r': 1 }, { '@r': 1 }]] }, { s: 1 }],
  classInstance: [{ method: 'log', id: 'k1', data: [{ x: 1, constructor: { name: 'Foo' } }] }],
  // console.log({ '@t': 'user', '@r': 2, '#@t': 'hash' })
  markerLikeKeys: [{ method: 'log', id: 'u1', data: [{ '#@t': 'user', '#@r': 2, '##@t': 'hash' }] }],
  warn: [{ method: 'warn', id: 'w1', data: ['careful'] }],
  // console.error(new Error('boom')) arrives as the stack string.
  error: [{ method: 'error', id: 'e1', data: ['Error: boom\n    at App (https://2-19-8-sandpack.codesandbox.io/App.js:29:17)'] }],
  typedArray: [
    { method: 'log', id: 't1', data: [{ '@t': '[[TypedArray]]', data: { ctorName: 'Uint8Array', arr: [1, 2] } }] },
  ],
};

describe('fromSandpackPayload', () => {
  it('decodes primitives and special numbers', () => {
    const entry = fromSandpackPayload(fixtures.primitives)!;
    expect(entry.level).toBe('log');
    expect(entry.args.map((a) => (a.t === 'prim' ? `${a.type}:${a.v}` : a.t))).toEqual([
      'string:hello',
      'number:42',
      'boolean:true',
      'null:null',
      'undefined:undefined',
      'number:NaN',
      'number:Infinity',
      'number:-0',
    ]);
  });

  it('decodes nested objects and arrays', () => {
    expect(fromSandpackPayload(fixtures.nested)!.args[0]).toEqual({
      t: 'object',
      entries: [
        ['a', { t: 'prim', type: 'number', v: '1' }],
        [
          'nested',
          {
            t: 'object',
            entries: [
              [
                'b',
                {
                  t: 'array',
                  len: 3,
                  items: [
                    { t: 'prim', type: 'number', v: '1' },
                    { t: 'prim', type: 'number', v: '2' },
                    { t: 'object', entries: [['c', { t: 'prim', type: 'string', v: 'd' }]] },
                  ],
                },
              ],
            ],
          },
        ],
      ],
    });
  });

  it('decodes Map (flattened pairs) and Set', () => {
    const [map, set] = fromSandpackPayload(fixtures.mapAndSet)!.args;
    expect(map).toMatchObject({ t: 'map', size: 1 });
    expect(map.t === 'map' && map.entries[0][1]).toMatchObject({ t: 'object', entries: [['deep', { v: 'true' }]] });
    expect(set).toMatchObject({ t: 'set', size: 2, items: [{ v: '1' }, { v: '2' }] });
  });

  it('decodes functions, dates, regexps and DOM elements', () => {
    expect(fromSandpackPayload(fixtures.fnDateRegexpDom)!.args).toEqual([
      { t: 'fn', name: 'named' },
      { t: 'special', v: '1970-01-01T00:00:00.000Z' },
      { t: 'special', v: '/x/g' },
      { t: 'dom', tag: 'div', attrs: '' },
    ]);
  });

  it('resolves references and marks the cycle', () => {
    expect(fromSandpackPayload(fixtures.circular)!.args[0]).toEqual({
      t: 'object',
      entries: [
        ['name', { t: 'prim', type: 'string', v: 'root' }],
        ['self', { t: 'circular' }],
      ],
    });
  });

  it('expands shared (non-cyclic) references in full', () => {
    const one = { t: 'object', entries: [['s', { t: 'prim', type: 'number', v: '1' }]] };
    expect(fromSandpackPayload(fixtures.shared)!.args[0]).toEqual({ t: 'array', len: 2, items: [one, one] });
  });

  it('keeps class names and un-escapes user keys that look like markers', () => {
    expect(fromSandpackPayload(fixtures.classInstance)!.args[0]).toMatchObject({ t: 'object', ctor: 'Foo', entries: [['x', {}]] });
    const obj = fromSandpackPayload(fixtures.markerLikeKeys)!.args[0];
    expect(obj.t === 'object' && obj.entries.map(([k]) => k)).toEqual(['@t', '@r', '#@t']);
  });

  it('maps levels and typed arrays', () => {
    expect(fromSandpackPayload(fixtures.warn)!.level).toBe('warn');
    expect(fromSandpackPayload(fixtures.error)).toMatchObject({ level: 'error', args: [{ t: 'prim', type: 'string' }] });
    expect(fromSandpackPayload(fixtures.typedArray)!.args[0]).toMatchObject({ t: 'array', ctor: 'Uint8Array', len: 2 });
  });

  it('treats console.clear as a single info row and ignores non-log payloads', () => {
    const clear = [{ method: 'clear', id: 'x' }];
    expect(isClearPayload(clear)).toBe(true);
    expect(fromSandpackPayload(clear)).toMatchObject({ level: 'info', args: [{ t: 'text', v: 'Console was cleared' }] });
    expect(fromSandpackPayload([{ name: 'no method' }])).toBeNull();
    expect(fromSandpackPayload(null)).toBeNull();
  });
});

describe('decodeSandpackValue', () => {
  it('decodes DOM attributes and Error values', () => {
    expect(
      decodeSandpackValue({ '@t': 'HTMLElement', data: { tagName: 'DIV', attributes: { id: 'app' }, innerHTML: '' } }),
    ).toEqual({ t: 'dom', tag: 'div', attrs: 'id="app"' });
    expect(decodeSandpackValue({ '@t': '[[Error]]', data: { name: 'TypeError', message: 'x', stack: 's' } })).toEqual({
      t: 'error',
      name: 'TypeError',
      message: 'x',
      stack: 's',
    });
  });

  it('treats a dangling reference as circular instead of throwing', () => {
    expect(decodeSandpackValue({ '@r': 7 }, [])).toEqual({ t: 'circular' });
  });

  it('caps items per level', () => {
    const big = decodeSandpackValue(Array.from({ length: 150 }, (_, i) => i));
    expect(big).toMatchObject({ t: 'array', len: 150, more: 50 });
    expect(big.t === 'array' && big.items).toHaveLength(100);
  });
});
