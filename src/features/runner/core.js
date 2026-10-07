// Judging core for DSA questions. Plain JS with no DOM, shared by the browser
// worker and `npm run verify`, so both grade a solution identically.
//
// A question's cases.json looks like:
// {
//   "fn": "twoSum",                         // display name only
//   "kind": "function" | "design" | "codec",
//   "params": [{ "name": "nums", "type": "number[]" }, ...],
//   "returns": "number[]",                  // or "void" with "mutates": <param index>
//   "compare": "exact" | "unordered" | "unordered-deep" | "float" | "checker",
//   "freshNodes": true,                     // output must not reuse input nodes (clone problems)
//   "cases": [{ "input": [...], "expected": ..., "hidden": true? }]
// }

/* ---------------------------------------------------------------- adapters */

const listFromArray = (arr) => {
  let head = null;
  for (let i = arr.length - 1; i >= 0; i--) head = { val: arr[i], next: head };
  return head;
};

function listToArray(head) {
  const out = [];
  const seen = new Set();
  for (let node = head; node; node = node.next) {
    if (seen.has(node)) throw new Error('Output linked list contains a cycle');
    seen.add(node);
    out.push(node.val);
  }
  return out;
}

function treeFromArray(arr) {
  if (!arr.length || arr[0] === null) return null;
  const root = { val: arr[0], left: null, right: null };
  const queue = [root];
  let i = 1;
  while (queue.length && i < arr.length) {
    const node = queue.shift();
    if (i < arr.length && arr[i] !== null) queue.push((node.left = { val: arr[i], left: null, right: null }));
    i++;
    if (i < arr.length && arr[i] !== null) queue.push((node.right = { val: arr[i], left: null, right: null }));
    i++;
  }
  return root;
}

function treeToArray(root) {
  const out = [];
  const queue = [root];
  const seen = new Set();
  while (queue.length) {
    const node = queue.shift();
    if (!node) {
      out.push(null);
      continue;
    }
    if (seen.has(node)) throw new Error('Output tree contains a cycle');
    seen.add(node);
    out.push(node.val);
    queue.push(node.left ?? null, node.right ?? null);
  }
  while (out.length && out[out.length - 1] === null) out.pop();
  return out;
}

function findTreeNode(root, val) {
  const stack = [root];
  while (stack.length) {
    const node = stack.pop();
    if (!node) continue;
    if (node.val === val) return node;
    stack.push(node.left, node.right);
  }
  return null;
}

// Graph: adjacency list where node i+1 has neighbours adj[i] (LeetCode "Clone Graph" format).
function graphFromAdj(adj) {
  if (!adj.length) return null;
  const nodes = adj.map((_, i) => ({ val: i + 1, neighbors: [] }));
  adj.forEach((ns, i) => {
    nodes[i].neighbors = ns.map((n) => nodes[n - 1]);
  });
  return nodes[0];
}

function graphToAdj(start) {
  if (!start) return [];
  const byVal = new Map();
  const queue = [start];
  while (queue.length) {
    const node = queue.shift();
    if (byVal.has(node.val)) continue;
    byVal.set(node.val, node);
    queue.push(...node.neighbors);
  }
  return [...byVal.keys()].sort((a, b) => a - b).map((v) => byVal.get(v).neighbors.map((n) => n.val));
}

// Random list: [[val, randomIndex | null], ...]
function randomListFromPairs(pairs) {
  const nodes = pairs.map(([val]) => ({ val, next: null, random: null }));
  nodes.forEach((node, i) => {
    node.next = nodes[i + 1] ?? null;
    const r = pairs[i][1];
    node.random = r === null ? null : nodes[r];
  });
  return nodes[0] ?? null;
}

function randomListToPairs(head) {
  const nodes = [];
  const seen = new Set();
  for (let n = head; n; n = n.next) {
    if (seen.has(n)) throw new Error('Output list contains a cycle');
    seen.add(n);
    nodes.push(n);
  }
  const index = new Map(nodes.map((n, i) => [n, i]));
  return nodes.map((n) => [n.val, n.random ? (index.has(n.random) ? index.get(n.random) : -1) : null]);
}

function collectNodes(value, type) {
  const out = new Set();
  if (!value) return out;
  if (type === 'GraphNode') {
    const queue = [value];
    while (queue.length) {
      const n = queue.shift();
      if (out.has(n)) continue;
      out.add(n);
      queue.push(...n.neighbors);
    }
  } else {
    for (let n = value; n && !out.has(n); n = n.next) out.add(n);
  }
  return out;
}

const clone = (v) => (v === undefined ? undefined : JSON.parse(JSON.stringify(v)));

/** Turns a JSON case value into what the solution receives. `built` = params built so far. */
export function toInput(param, value, built = []) {
  switch (param.type) {
    case 'ListNode':
      return listFromArray(value);
    case 'ListNode[]':
      return value.map(listFromArray);
    case 'ListNodeCycle': {
      // { "list": [3, 2, 0, -4], "pos": 1 } → tail links back to index `pos` (-1 = no cycle)
      const head = listFromArray(value.list);
      if (value.pos >= 0 && head) {
        let tail = head;
        let target = null;
        for (let i = 0; tail; i++) {
          if (i === value.pos) target = tail;
          if (!tail.next) break;
          tail = tail.next;
        }
        tail.next = target;
      }
      return head;
    }
    case 'TreeNode':
      return treeFromArray(value);
    case 'TreeNodeRef':
      // A node inside the tree passed as param `of`, identified by its value.
      return findTreeNode(built[param.of ?? 0], value);
    case 'GraphNode':
      return graphFromAdj(value);
    case 'RandomListNode':
      return randomListFromPairs(value);
    default:
      return clone(value);
  }
}

/** Turns what the solution returned into comparable JSON. */
export function fromOutput(type, value) {
  if (value === undefined) value = null;
  switch (type) {
    case 'ListNode':
      return listToArray(value);
    case 'ListNodeCycle':
      return listToArray(value);
    case 'TreeNode':
      return treeToArray(value);
    case 'TreeNodeVal':
      return value ? value.val : null;
    case 'GraphNode':
      return graphToAdj(value);
    case 'RandomListNode':
      return randomListToPairs(value);
    default:
      return normalize(value);
  }
}

/** JSON-safe copy: undefined → null, Sets/Maps → arrays, -0 → 0. */
function normalize(value) {
  if (value === undefined || value === null) return null;
  if (typeof value === 'number') return Object.is(value, -0) ? 0 : value;
  if (typeof value !== 'object') return value;
  if (value instanceof Set) return [...value].map(normalize);
  if (value instanceof Map) return [...value.entries()].map(normalize);
  if (Array.isArray(value)) return Array.from(value, normalize);
  return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, normalize(v)]));
}

export const KNOWN_TYPES = new Set([
  'number', 'string', 'boolean', 'any', 'void',
  'number[]', 'string[]', 'boolean[]', 'number[][]', 'string[][]', 'char[][]', 'any[]',
  'ListNode', 'ListNode[]', 'ListNodeCycle', 'TreeNode', 'TreeNodeRef', 'TreeNodeVal',
  'GraphNode', 'RandomListNode',
]);

/* -------------------------------------------------------------- comparison */

const key = (v) => JSON.stringify(v);
const sortByKey = (arr) => [...arr].sort((a, b) => (key(a) < key(b) ? -1 : key(a) > key(b) ? 1 : 0));

function deepEqual(a, b, tolerance = 0) {
  if (typeof a === 'number' && typeof b === 'number') {
    return tolerance ? Math.abs(a - b) <= tolerance * Math.max(1, Math.abs(b)) : a === b;
  }
  if (a === b) return true;
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const ka = Object.keys(a);
  const kb = Object.keys(b);
  return ka.length === kb.length && ka.every((k) => deepEqual(a[k], b[k], tolerance));
}

/**
 * @param {object} spec
 * @param {any} output     serialized output
 * @param {any} expected   expected value from cases.json (unused for checker)
 * @param {any[]} input    raw JSON input of the case
 * @param {Function} [checker] (input, output) => boolean
 */
export function judge(spec, output, expected, input, checker) {
  switch (spec.compare ?? 'exact') {
    case 'unordered':
      return Array.isArray(output) && Array.isArray(expected) && deepEqual(sortByKey(output), sortByKey(expected));
    case 'unordered-deep': {
      const canon = (v) => sortByKey(v.map((x) => (Array.isArray(x) ? sortByKey(x) : x)));
      return Array.isArray(output) && Array.isArray(expected) && deepEqual(canon(output), canon(expected));
    }
    case 'float':
      return deepEqual(output, expected, 1e-5);
    case 'checker':
      if (!checker) throw new Error('compare: "checker" needs a checker.js');
      return Boolean(checker(clone(input), clone(output)));
    default:
      return deepEqual(output, expected);
  }
}

/* --------------------------------------------------------------- execution */

/**
 * Runs one case against a solution module's default export.
 * Returns the serialized output; throws whatever the solution throws.
 */
export async function execute(spec, exported, input) {
  if (exported === undefined) throw new Error('Your file has no `export default`.');
  const kind = spec.kind ?? 'function';

  if (kind === 'design') {
    // LeetCode-style: input = [["Cls", "op", ...], [[ctorArgs], [args], ...]]
    const [ops, args] = input;
    let instance;
    const out = [];
    for (let i = 0; i < ops.length; i++) {
      if (i === 0) {
        instance = new exported(...clone(args[0]));
        out.push(null);
      } else {
        if (typeof instance[ops[i]] !== 'function') throw new Error(`${ops[0]}.${ops[i]} is not a function`);
        out.push(normalize(await instance[ops[i]](...clone(args[i]))));
      }
    }
    return out;
  }

  if (kind === 'codec') {
    // Round trip: decode(encode(x)) must give x back. `methods` = [encodeName, decodeName].
    const [encodeName, decodeName] = spec.methods ?? ['encode', 'decode'];
    const param = spec.params[0];
    const value = toInput(param, input[0]);
    const encoded = await exported[encodeName](value);
    if (typeof encoded !== 'string') throw new Error(`${encodeName} must return a string`);
    const decoded = await exported[decodeName](encoded);
    return fromOutput(spec.returns ?? param.type, decoded);
  }

  if (typeof exported !== 'function') throw new Error('The default export must be a function.');
  const built = [];
  spec.params.forEach((p, i) => built.push(toInput(p, input[i], built)));
  const inputNodes =
    spec.freshNodes && spec.params[0] ? collectNodes(built[0], spec.params[0].type) : null;

  const result = await exported(...built);

  if (inputNodes) {
    const reused = [...collectNodes(result, spec.returns)].some((n) => inputNodes.has(n));
    if (reused) throw new Error('Output reuses nodes from the input; it must be a deep copy.');
  }
  if (spec.returns === 'void' || spec.mutates !== undefined) {
    const idx = spec.mutates ?? 0;
    return fromOutput(spec.params[idx].type, built[idx]);
  }
  return fromOutput(spec.returns, result);
}

/** Display helper: `nums = [2,7,11,15]` per param (design: ops + args). */
export function formatInput(spec, input) {
  if ((spec.kind ?? 'function') === 'design') {
    return [
      { name: 'operations', value: JSON.stringify(input[0]) },
      { name: 'arguments', value: JSON.stringify(input[1]) },
    ];
  }
  return spec.params.map((p, i) => ({ name: p.name, value: JSON.stringify(input[i]) }));
}

/** Pulls `line N` out of an error stack for code loaded from a blob/module URL. */
export function errorLine(error, marker = 'blob:') {
  const stack = String(error?.stack ?? '');
  const line = stack.split('\n').find((l) => l.includes(marker));
  const match = line && /:(\d+):(\d+)\)?\s*$/.exec(line);
  return match ? Number(match[1]) : null;
}
