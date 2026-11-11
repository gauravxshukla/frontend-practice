import type { InspectValue, LogEntry, LogLevel } from './types';

// Decodes console messages posted by Sandpack's preview iframe.
//
// The runtime bundler behind the react / vanilla templates hooks `console.*` with
// console-feed's encoder. On the wire:
// - `message.log` is an array: [0] is `{ method, id, data }`, and [n ≥ 1] are
//   referenced objects; `{ "@r": n }` points at `log[n]` (cycles, shared objects);
// - special values are `{ "@t": "<type>", data }` (undefined, NaN, ±Infinity, -0,
//   functions, DOM elements, Date, RegExp, Error, Map, Set, typed arrays);
// - a user key that itself looks like a marker (`@t`, `#@r`…) gets one extra `#`;
// - a class instance carries `constructor: { name }`.
// Sandpack's own useSandpackConsole mistakes the referenced objects for log
// entries, which is why we decode raw messages here. The format is internal to
// Sandpack, so fromSandpack.test.ts pins it with messages captured from a real preview.

const TYPE_KEY = '@t';
const REF_KEY = '@r';
const ESCAPED_USER_KEY = /^#+@(t|r)$/;
const MAX_ITEMS = 100;
const MAX_DEPTH = 8;
/** Shared references expand at every use; this bounds the work for one log. */
const NODE_BUDGET = 5000;

type Encoded = Record<string, unknown>;

interface DecodeContext {
  refs: unknown[];
  /** Refs being expanded right now: meeting one again means a cycle. */
  active: Set<number>;
  budget: number;
}

const isObject = (v: unknown): v is Encoded => typeof v === 'object' && v !== null;

function attrsOf(attributes: unknown) {
  if (!isObject(attributes)) return '';
  return Object.entries(attributes)
    .map(([k, v]) => `${k}="${String(v)}"`)
    .join(' ');
}

function decodeList(list: unknown[], ctx: DecodeContext, depth: number) {
  return {
    items: list.slice(0, MAX_ITEMS).map((v) => decode(v, ctx, depth + 1)),
    ...(list.length > MAX_ITEMS && { more: list.length - MAX_ITEMS }),
  };
}

function decodeTransformed(type: string, data: unknown, ctx: DecodeContext, depth: number): InspectValue {
  switch (type) {
    case '[[undefined]]':
      return { t: 'prim', type: 'undefined', v: 'undefined' };
    case '[[NaN]]':
      return { t: 'prim', type: 'number', v: 'NaN' };
    case 'Arithmetic':
      return { t: 'prim', type: 'number', v: ['Infinity', '-Infinity', '-0'][data as number] ?? String(data) };
    case 'Function': {
      const fn = isObject(data) ? data : {};
      return { t: 'fn', name: typeof fn.name === 'string' && fn.name ? fn.name : 'anonymous' };
    }
    case 'HTMLElement': {
      const el = isObject(data) ? data : {};
      return { t: 'dom', tag: String(el.tagName ?? 'element').toLowerCase(), attrs: attrsOf(el.attributes) };
    }
    case '[[Date]]': {
      const date = new Date(data as number);
      return { t: 'special', v: Number.isNaN(date.getTime()) ? 'Invalid Date' : date.toISOString() };
    }
    case '[[RegExp]]': {
      const re = isObject(data) ? data : {};
      return { t: 'special', v: `/${String(re.src ?? '')}/${String(re.flags ?? '')}` };
    }
    case '[[Error]]': {
      const err = isObject(data) ? data : {};
      return {
        t: 'error',
        name: String(err.name ?? 'Error'),
        message: String(err.message ?? ''),
        stack: typeof err.stack === 'string' ? err.stack : undefined,
      };
    }
    case '[[Map]]': {
      // Flattened as [k1, v1, k2, v2, …].
      const flat = Array.isArray(data) ? data : [];
      const size = Math.floor(flat.length / 2);
      const entries: [InspectValue, InspectValue][] = [];
      for (let i = 0; i < Math.min(size, MAX_ITEMS); i++) {
        entries.push([decode(flat[2 * i], ctx, depth + 1), decode(flat[2 * i + 1], ctx, depth + 1)]);
      }
      return { t: 'map', size, entries, ...(size > MAX_ITEMS && { more: size - MAX_ITEMS }) };
    }
    case '[[Set]]': {
      const list = Array.isArray(data) ? data : [];
      return { t: 'set', size: list.length, ...decodeList(list, ctx, depth) };
    }
    case '[[TypedArray]]': {
      const typed = isObject(data) ? data : {};
      const arr = Array.isArray(typed.arr) ? typed.arr : [];
      return { t: 'array', len: arr.length, ctor: String(typed.ctorName ?? 'TypedArray'), ...decodeList(arr, ctx, depth) };
    }
    case '[[ArrayBuffer]]':
      return { t: 'special', v: `ArrayBuffer(${Array.isArray(data) ? data.length : 0})` };
    default:
      return { t: 'special', v: `[${type}]` };
  }
}

/** A class instance is encoded with an extra `constructor: { name }` entry. */
function isCtorMarker(key: string, value: unknown): value is { name: string } {
  return key === 'constructor' && isObject(value) && typeof value.name === 'string' && Object.keys(value).length === 1;
}

function decodeRef(index: unknown, ctx: DecodeContext, depth: number): InspectValue {
  const n = Number(index);
  if (!Number.isInteger(n) || n < 1 || n >= ctx.refs.length || ctx.active.has(n)) return { t: 'circular' };
  ctx.active.add(n);
  try {
    return decode(ctx.refs[n], ctx, depth);
  } finally {
    ctx.active.delete(n);
  }
}

function decode(value: unknown, ctx: DecodeContext, depth: number): InspectValue {
  if (--ctx.budget < 0) return { t: 'special', v: '…' };
  if (value === null) return { t: 'prim', type: 'null', v: 'null' };
  switch (typeof value) {
    case 'string':
      return { t: 'prim', type: 'string', v: value };
    case 'number':
      return { t: 'prim', type: 'number', v: String(value) };
    case 'boolean':
      return { t: 'prim', type: 'boolean', v: String(value) };
    case 'undefined':
      return { t: 'prim', type: 'undefined', v: 'undefined' };
  }
  if (isObject(value) && REF_KEY in value) return decodeRef(value[REF_KEY], ctx, depth);
  if (isObject(value) && typeof value[TYPE_KEY] === 'string') return decodeTransformed(value[TYPE_KEY] as string, value.data, ctx, depth);
  if (depth >= MAX_DEPTH) return { t: 'special', v: Array.isArray(value) ? `Array(${value.length})` : '{…}' };
  if (Array.isArray(value)) return { t: 'array', len: value.length, ...decodeList(value, ctx, depth) };
  if (!isObject(value)) return { t: 'special', v: String(value) };

  let ctor: string | undefined;
  let total = 0;
  const entries: [string, InspectValue][] = [];
  for (const [key, raw] of Object.entries(value)) {
    if (isCtorMarker(key, raw)) {
      if (raw.name !== 'Object') ctor = raw.name;
      continue;
    }
    total++;
    if (entries.length < MAX_ITEMS) {
      entries.push([ESCAPED_USER_KEY.test(key) ? key.slice(1) : key, decode(raw, ctx, depth + 1)]);
    }
  }
  return { t: 'object', entries, ...(ctor && { ctor }), ...(total > MAX_ITEMS && { more: total - MAX_ITEMS }) };
}

/** Decodes one wire value. `refs` is the message's `log` array, for `@r` pointers. */
export function decodeSandpackValue(value: unknown, refs: unknown[] = []): InspectValue {
  return decode(value, { refs, active: new Set(), budget: NODE_BUDGET }, 0);
}

function levelOf(method: string): LogLevel {
  switch (method) {
    case 'warn':
    case 'error':
    case 'info':
    case 'debug':
      return method;
    default:
      // log, table, count, time/timeEnd, assert (already mapped to error upstream)…
      return 'log';
  }
}

/** Whether a `console` message's `log` is a `console.clear()` call. */
export function isClearPayload(payload: unknown): boolean {
  const log = Array.isArray(payload) ? payload[0] : payload;
  return isObject(log) && log.method === 'clear';
}

/**
 * Turns the `log` of one Sandpack `console` message into a LogEntry.
 * Returns null for anything that isn't a console call.
 */
export function fromSandpackPayload(payload: unknown): LogEntry | null {
  const refs = Array.isArray(payload) ? payload : [payload];
  const log = refs[0];
  if (!isObject(log) || typeof log.method !== 'string') return null;
  const id = String(log.id ?? '');
  if (log.method === 'clear') return { id, level: 'info', args: [{ t: 'text', v: 'Console was cleared' }], count: 1 };
  const data = Array.isArray(log.data) ? log.data : [];
  // One budget per log line, shared by its arguments.
  const ctx: DecodeContext = { refs, active: new Set(), budget: NODE_BUDGET };
  return { id, level: levelOf(log.method), args: data.map((v) => decode(v, ctx, 0)), count: 1 };
}
