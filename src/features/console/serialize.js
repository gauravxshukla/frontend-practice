// Turns a live JS value into an InspectValue (see ./types.ts): plain JSON that
// survives postMessage. Plain JS (no TS) because the runner worker and Node-side
// tests import it directly.
//
// Caps keep a careless `console.log(hugeGrid)` inside a DSA loop from flooding
// postMessage: at most MAX_ITEMS children per level and MAX_DEPTH levels.

export const MAX_DEPTH = 6;
export const MAX_ITEMS = 100;

/** @typedef {import('./types').InspectValue} InspectValue */

const prim = (type, v) => ({ t: 'prim', type, v });

function ctorName(value) {
  const proto = Object.getPrototypeOf(value);
  if (proto === null) return undefined;
  const name = proto.constructor?.name;
  return name && name !== 'Object' ? name : undefined;
}

const isDomNode = (v) => typeof v.nodeType === 'number' && typeof v.nodeName === 'string';

function domOf(node) {
  if (node.nodeType === 1) {
    const attrs = Array.from(node.attributes ?? [], (a) => `${a.name}="${a.value}"`).join(' ');
    return { t: 'dom', tag: String(node.tagName).toLowerCase(), attrs };
  }
  if (node.nodeType === 3) return { t: 'special', v: `#text ${JSON.stringify(node.textContent ?? '')}` };
  return { t: 'special', v: String(node.nodeName).toLowerCase() };
}

/** Reads `obj[key]`, turning a throwing getter into a placeholder instead of an exception. */
function read(obj, key, depth, seen) {
  try {
    return serializeValue(obj[key], depth, seen);
  } catch {
    return { t: 'special', v: '[Getter threw]' };
  }
}

/**
 * @param {unknown} value
 * @param {number} [depth]
 * @param {WeakSet<object>} [seen] ancestors of `value`; a repeat means a cycle
 * @returns {InspectValue}
 */
export function serializeValue(value, depth = 0, seen = new WeakSet()) {
  switch (typeof value) {
    case 'string':
      return prim('string', value);
    case 'number':
      return prim('number', Object.is(value, -0) ? '-0' : String(value));
    case 'boolean':
      return prim('boolean', String(value));
    case 'bigint':
      return prim('bigint', `${value}n`);
    case 'symbol':
      return prim('symbol', value.toString());
    case 'undefined':
      return prim('undefined', 'undefined');
    case 'function': {
      let isClass = false;
      try {
        isClass = /^class\b/.test(Function.prototype.toString.call(value));
      } catch {
        // Some host functions refuse toString; treat them as plain functions.
      }
      return { t: 'fn', name: value.name || 'anonymous', isClass };
    }
  }
  if (value === null) return prim('null', 'null');
  if (seen.has(value)) return { t: 'circular' };

  if (value instanceof Error) return { t: 'error', name: value.name, message: value.message, stack: value.stack };
  if (value instanceof Date) return { t: 'special', v: Number.isNaN(value.getTime()) ? 'Invalid Date' : value.toISOString() };
  if (value instanceof RegExp) return { t: 'special', v: String(value) };
  if (value instanceof Promise) return { t: 'special', v: 'Promise {…}' };
  if (value instanceof WeakMap) return { t: 'special', v: 'WeakMap {…}' };
  if (value instanceof WeakSet) return { t: 'special', v: 'WeakSet {…}' };
  if (isDomNode(value)) return domOf(value);

  const isArrayLike = Array.isArray(value) || (ArrayBuffer.isView(value) && !(value instanceof DataView));
  if (depth >= MAX_DEPTH) {
    if (isArrayLike) return { t: 'special', v: `Array(${value.length})` };
    if (value instanceof Map) return { t: 'special', v: `Map(${value.size})` };
    if (value instanceof Set) return { t: 'special', v: `Set(${value.size})` };
    return { t: 'special', v: `${ctorName(value) ?? ''} {…}`.trim() };
  }

  seen.add(value);
  try {
    if (isArrayLike) {
      const len = value.length;
      const items = [];
      for (let i = 0; i < Math.min(len, MAX_ITEMS); i++) {
        items.push(i in value ? read(value, i, depth + 1, seen) : { t: 'special', v: '<empty>' });
      }
      return {
        t: 'array',
        len,
        items,
        ...(len > MAX_ITEMS && { more: len - MAX_ITEMS }),
        ...(!Array.isArray(value) && { ctor: value.constructor.name }),
      };
    }
    if (value instanceof Map) {
      const entries = [];
      for (const [k, v] of value) {
        if (entries.length === MAX_ITEMS) break;
        entries.push([serializeValue(k, depth + 1, seen), serializeValue(v, depth + 1, seen)]);
      }
      return { t: 'map', size: value.size, entries, ...(value.size > MAX_ITEMS && { more: value.size - MAX_ITEMS }) };
    }
    if (value instanceof Set) {
      const items = [];
      for (const v of value) {
        if (items.length === MAX_ITEMS) break;
        items.push(serializeValue(v, depth + 1, seen));
      }
      return { t: 'set', size: value.size, items, ...(value.size > MAX_ITEMS && { more: value.size - MAX_ITEMS }) };
    }
    const keys = Object.keys(value);
    const entries = keys.slice(0, MAX_ITEMS).map((k) => [k, read(value, k, depth + 1, seen)]);
    const ctor = ctorName(value);
    return {
      t: 'object',
      entries,
      ...(ctor && { ctor }),
      ...(keys.length > MAX_ITEMS && { more: keys.length - MAX_ITEMS }),
    };
  } finally {
    // Only ancestors count as cycles; the same object reached twice by different paths is fine.
    seen.delete(value);
  }
}
