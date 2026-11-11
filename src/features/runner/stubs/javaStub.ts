import type { DsaSpec } from '../../../lib/content/catalog';
import { jsClassMethods } from './pythonStub';

// Generates a LeetCode-style Java starter from a question's cases.json. Java
// needs concrete types, so they're inferred from the case data (int vs long vs
// double, int[][] vs List<List<Integer>>). The harness reads the real signature
// by reflection, so a user can still change any type and it keeps working.
// A committed starter.java in the question folder overrides this.

const NODE_DOCS: Record<string, string> = {
  ListNode: `/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */`,
  TreeNode: `/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */`,
  GraphNode: `/*
// Definition for a Node.
class Node {
    public int val;
    public List<Node> neighbors;
    public Node() { val = 0; neighbors = new ArrayList<Node>(); }
    public Node(int _val) { val = _val; neighbors = new ArrayList<Node>(); }
    public Node(int _val, ArrayList<Node> _neighbors) { val = _val; neighbors = _neighbors; }
}
*/`,
  RandomListNode: `/*
// Definition for a Node.
class Node {
    int val;
    Node next;
    Node random;

    public Node(int val) {
        this.val = val;
        this.next = null;
        this.random = null;
    }
}
*/`,
};

const NODE_OF: Record<string, string> = {
  ListNode: 'ListNode',
  'ListNode[]': 'ListNode',
  ListNodeCycle: 'ListNode',
  TreeNode: 'TreeNode',
  TreeNodeRef: 'TreeNode',
  TreeNodeVal: 'TreeNode',
  GraphNode: 'GraphNode',
  RandomListNode: 'RandomListNode',
};

const INT_MAX = 2 ** 31 - 1;

/** `int`, `long` or `double`, whichever holds every value. */
function numberType(values: unknown[]): 'int' | 'long' | 'double' {
  const nums = values.filter((v): v is number => typeof v === 'number');
  if (nums.some((n) => !Number.isInteger(n))) return 'double';
  if (nums.some((n) => n > INT_MAX || n < -INT_MAX - 1)) return 'long';
  return 'int';
}

const flat = (values: unknown[], depth: number): unknown[] =>
  depth === 0 ? values : flat(values.flatMap((v) => (Array.isArray(v) ? v : [])), depth - 1);

const boxed = (t: string) => ({ int: 'Integer', long: 'Long', double: 'Double', boolean: 'Boolean' })[t] ?? t;

/** Java type for a cases.json param type, given every value it takes. */
function paramType(type: string, values: unknown[]): string {
  switch (type) {
    case 'number':
      return numberType(values);
    case 'number[]':
      return `${numberType(flat(values, 1))}[]`;
    case 'number[][]':
      return `${numberType(flat(values, 2))}[][]`;
    case 'string':
      return 'String';
    case 'string[]':
      return 'String[]';
    case 'string[][]':
      return 'List<List<String>>';
    case 'char[][]':
      return 'char[][]';
    case 'boolean':
      return 'boolean';
    case 'boolean[]':
      return 'boolean[]';
    case 'any[]':
      return 'List<Object>';
    case 'ListNode':
    case 'ListNodeCycle':
      return 'ListNode';
    case 'ListNode[]':
      return 'ListNode[]';
    case 'TreeNode':
    case 'TreeNodeRef':
    case 'TreeNodeVal':
      return 'TreeNode';
    case 'GraphNode':
    case 'RandomListNode':
      return 'Node';
    default:
      return 'Object';
  }
}

/** Return type: like a param, but lists of lists follow LeetCode (List<List<…>> unless rows are uniform). */
function returnType(spec: DsaSpec): string {
  const returns = spec.returns ?? 'any';
  const expected = spec.cases.filter((c) => 'expected' in c).map((c) => c.expected);
  const unordered = spec.compare === 'unordered' || spec.compare === 'unordered-deep';
  switch (returns) {
    case 'void':
      return 'void';
    case 'number':
      return spec.compare === 'float' ? 'double' : numberType(expected);
    case 'number[][]': {
      const rows = expected.flatMap((e) => (Array.isArray(e) ? e : []));
      const widths = new Set(rows.map((r) => (Array.isArray(r) ? r.length : -1)));
      const elem = numberType(flat(expected, 2));
      return unordered || widths.size > 1 ? `List<List<${boxed(elem)}>>` : `${elem}[][]`;
    }
    case 'string[]':
      return 'List<String>';
    default:
      return paramType(returns, expected);
  }
}

const defaultReturn = (type: string) =>
  type === 'void' ? '' : `\n        return ${{ int: '0', long: '0', double: '0', boolean: 'false' }[type] ?? 'null'};`;

function withDocs(types: (string | undefined)[], body: string) {
  const nodes = [...new Set(types.map((t) => (t ? NODE_OF[t] : undefined)).filter(Boolean) as string[])];
  const docs = nodes.map((n) => NODE_DOCS[n]);
  return `${docs.length ? `${docs.join('\n')}\n` : ''}${body}\n`;
}

function method(signature: string, returns: string, note = '') {
  return `    public ${signature} {\n        // Your code here${note}${defaultReturn(returns)}\n    }`;
}

function functionStub(spec: DsaSpec): string {
  const params = spec.params ?? [];
  const args = params.map((p, i) => `${paramType(p.type, spec.cases.map((c) => c.input[i]))} ${p.name}`).join(', ');
  const returns = returnType(spec);
  const mutated = spec.returns === 'void' ? params[spec.mutates ?? 0]?.name : undefined;
  const note = mutated ? ` (modify ${mutated} in place)` : '';
  return withDocs(
    [...params.map((p) => p.type), spec.returns],
    `class Solution {\n${method(`${returns} ${spec.fn}(${args})`, returns, note)}\n}`,
  );
}

/** Java type for a design method's argument or result, from the values it's called with. */
function valueType(values: unknown[], float: boolean): string {
  const present = values.filter((v) => v !== null && v !== undefined);
  if (!present.length) return 'Object';
  if (present.every((v) => typeof v === 'number')) return float ? 'double' : numberType(present);
  if (present.every((v) => typeof v === 'boolean')) return 'boolean';
  if (present.every((v) => typeof v === 'string')) return 'String';
  if (present.every(Array.isArray)) {
    const items = flat(present, 1);
    if (items.every((v) => typeof v === 'number')) return `${numberType(items)}[]`;
    if (items.every((v) => typeof v === 'string')) return 'String[]';
  }
  return 'Object';
}

/** Design questions return lists as List<…> (getNewsFeed → List<Integer>). */
function designReturn(values: unknown[], float: boolean): string {
  if (values.every((v) => v === null || v === undefined)) return 'void';
  const t = valueType(values, float);
  return t.endsWith('[]') ? `List<${boxed(t.slice(0, -2))}>` : t;
}

function designStub(spec: DsaSpec, jsStarter: string): string {
  const float = spec.compare === 'float';
  const calls = spec.cases.map((c) => c.input as [string[], unknown[][]]);
  const className = calls[0]?.[0]?.[0] ?? spec.fn;
  const argsOf = (op: string, pos: number) =>
    calls.flatMap(([ops, args]) => ops.flatMap((o, i) => (o === op && i > 0 ? [args[i]?.[pos]] : [])));
  const resultsOf = (op: string) =>
    spec.cases.flatMap((c) => {
      const [ops] = c.input as [string[]];
      return ops.flatMap((o, i) => (o === op && i > 0 ? [(c.expected as unknown[] | undefined)?.[i]] : []));
    });
  const ctorArgs = (pos: number) => calls.map(([, args]) => args[0]?.[pos]);

  const methods = jsClassMethods(jsStarter);
  const defs = (methods.length ? methods : [{ name: 'constructor', params: [] }]).map(({ name, params }) => {
    if (name === 'constructor') {
      const sig = params.map((p, i) => `${valueType(ctorArgs(i), false)} ${p}`).join(', ');
      return `    public ${className}(${sig}) {\n        // Your code here\n    }`;
    }
    const returns = designReturn(resultsOf(name), float);
    const sig = params.map((p, i) => `${valueType(argsOf(name, i), false)} ${p}`).join(', ');
    return method(`${returns} ${name}(${sig})`, returns);
  });
  return `class ${className} {\n\n${defs.join('\n\n')}\n}\n`;
}

function codecStub(spec: DsaSpec, jsStarter: string): string {
  const [encodeName, decodeName] = spec.methods ?? ['encode', 'decode'];
  const param = spec.params?.[0] ?? { name: 'value', type: 'any' };
  // LeetCode's codecs take and return lists, not arrays.
  const javaType = (t: string) => (t === 'string[]' ? 'List<String>' : paramType(t, []));
  const fns = [...jsStarter.matchAll(/function\s+([A-Za-z_$][\w$]*)\s*\(([^)]*)\)/g)];
  const argOf = (fn: string, fallback: string) => fns.find((m) => m[1] === fn)?.[2].split(',')[0]?.trim() || fallback;
  const returns = javaType(spec.returns ?? param.type);
  return withDocs(
    [param.type, spec.returns],
    `class Codec {\n${method(`String ${encodeName}(${javaType(param.type)} ${argOf(encodeName, param.name)})`, 'String')}\n\n` +
      `${method(`${returns} ${decodeName}(String ${argOf(decodeName, 'data')})`, returns)}\n}`,
  );
}

/**
 * @param jsStarter the question's starter.js: design and codec questions take
 *   method and argument names from it, since cases.json doesn't describe them.
 */
export function javaStub(spec: DsaSpec, jsStarter = ''): string {
  switch (spec.kind ?? 'function') {
    case 'design':
      return designStub(spec, jsStarter);
    case 'codec':
      return codecStub(spec, jsStarter);
    default:
      return functionStub(spec);
  }
}
