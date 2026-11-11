import type { InspectValue, LogEntry } from './types';

// One-line, DevTools-style summaries: `(3) [1, 2, 3]`, `{a: 1, b: {…}}`,
// `Map(2) {"a" => 1, …}`. Nested containers collapse to `{…}` / `Array(n)` so a
// summary never explodes, and the whole line is cut at `budget` characters.

/** Summary of a value nested inside another value's preview. */
function nested(v: InspectValue): string {
  switch (v.t) {
    case 'prim':
      return v.type === 'string' ? JSON.stringify(v.v) : v.v;
    case 'array':
      return `${v.ctor ?? 'Array'}(${v.len})`;
    case 'object':
      return v.ctor ? `${v.ctor}` : '{…}';
    case 'map':
      return `Map(${v.size})`;
    case 'set':
      return `Set(${v.size})`;
    default:
      return previewOf(v, 40);
  }
}

function joinWithin(parts: string[], budget: number, hasMore: boolean) {
  let out = '';
  for (const [i, part] of parts.entries()) {
    const next = out ? `${out}, ${part}` : part;
    if (next.length > budget) return `${out}${i ? ', ' : ''}…`;
    out = next;
  }
  return hasMore ? `${out}${out ? ', ' : ''}…` : out;
}

/**
 * @param top true for a value logged directly (`console.log("hi")` shows `hi`, not `"hi"`)
 */
export function previewOf(v: InspectValue, budget = 80, top = false): string {
  switch (v.t) {
    case 'prim':
      return v.type === 'string' && !top ? JSON.stringify(v.v) : v.v;
    case 'text':
    case 'special':
      return v.v;
    case 'circular':
      return '[Circular]';
    case 'fn':
      return v.isClass ? `class ${v.name}` : `ƒ ${v.name}()`;
    case 'dom':
      return `<${v.tag}${v.attrs ? ` ${v.attrs}` : ''}>`;
    case 'error':
      return `${v.name}: ${v.message}`;
    case 'array': {
      const body = joinWithin(v.items.map(nested), budget, v.len > v.items.length);
      return `${v.ctor ?? ''}(${v.len}) [${body}]`;
    }
    case 'set':
      return `Set(${v.size}) {${joinWithin(v.items.map(nested), budget, v.size > v.items.length)}}`;
    case 'map': {
      const parts = v.entries.map(([k, val]) => `${nested(k)} => ${nested(val)}`);
      return `Map(${v.size}) {${joinWithin(parts, budget, v.size > v.entries.length)}}`;
    }
    case 'object': {
      const parts = v.entries.map(([k, val]) => `${k}: ${nested(val)}`);
      const body = joinWithin(parts, budget, Boolean(v.more));
      return `${v.ctor ? `${v.ctor} ` : ''}{${body}}`;
    }
  }
}

/** Whether a value has children worth expanding. */
export function isExpandable(v: InspectValue): boolean {
  switch (v.t) {
    case 'array':
    case 'set':
      return v.items.length > 0;
    case 'map':
    case 'object':
      return v.entries.length > 0;
    case 'error':
      return Boolean(v.stack);
    default:
      return false;
  }
}

/** Plain text of a whole log line, used by the console's text filter. */
export function entryText(entry: LogEntry): string {
  return entry.args.map((a) => previewOf(a, 400, true)).join(' ');
}
