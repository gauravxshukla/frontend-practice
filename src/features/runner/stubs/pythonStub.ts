import type { DsaSpec } from '../../../lib/content/catalog';

// Generates a LeetCode-style Python starter from a question's cases.json, so
// every DSA question gets Python without hand-writing 150 files. A committed
// starter.py in the question folder overrides this.

const NODE_DOCS: Record<string, string> = {
  ListNode: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next`,
  TreeNode: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right`,
  GraphNode: `# Definition for a Node.
# class Node:
#     def __init__(self, val = 0, neighbors = None):
#         self.val = val
#         self.neighbors = neighbors if neighbors is not None else []`,
  RandomListNode: `# Definition for a Node.
# class Node:
#     def __init__(self, x: int, next: 'Node' = None, random: 'Node' = None):
#         self.val = int(x)
#         self.next = next
#         self.random = random`,
};

/** Which node definition a cases.json type relies on. */
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

function pyType(type: string, isFloat: boolean): string {
  switch (type) {
    case 'number':
      return isFloat ? 'float' : 'int';
    case 'number[]':
      return 'List[int]';
    case 'number[][]':
      return 'List[List[int]]';
    case 'string':
      return 'str';
    case 'string[]':
      return 'List[str]';
    case 'string[][]':
    case 'char[][]':
      return 'List[List[str]]';
    case 'boolean':
      return 'bool';
    case 'boolean[]':
      return 'List[bool]';
    case 'any[]':
      return 'List[Any]';
    case 'ListNode':
    case 'ListNodeCycle':
      return 'Optional[ListNode]';
    case 'ListNode[]':
      return 'List[Optional[ListNode]]';
    case 'TreeNode':
      return 'Optional[TreeNode]';
    case 'TreeNodeRef':
    case 'TreeNodeVal':
      return "'TreeNode'";
    case 'GraphNode':
    case 'RandomListNode':
      return "Optional['Node']";
    case 'void':
      return 'None';
    default:
      return 'Any';
  }
}

interface JsMethod {
  name: string;
  params: string[];
}

const NOT_METHODS = new Set(['if', 'for', 'while', 'switch', 'catch', 'function', 'return']);

/** Methods (and constructor) of the class in a JS starter: `put(key, value) {` → { put, [key, value] }. */
export function jsClassMethods(js: string): JsMethod[] {
  const out: JsMethod[] = [];
  for (const m of js.matchAll(/^\s*([A-Za-z_$][\w$]*)\s*\(([^)]*)\)\s*\{/gm)) {
    if (NOT_METHODS.has(m[1])) continue;
    out.push({ name: m[1], params: m[2].split(',').map((p) => p.trim().replace(/\s*=.*$/, '')).filter(Boolean) });
  }
  return out;
}

/** Top-level functions in a JS starter: `function encode(strs) {` → { encode, [strs] }. */
function jsFunctions(js: string): JsMethod[] {
  return [...js.matchAll(/function\s+([A-Za-z_$][\w$]*)\s*\(([^)]*)\)/g)].map((m) => ({
    name: m[1],
    params: m[2].split(',').map((p) => p.trim()).filter(Boolean),
  }));
}

const usedNodes = (types: string[]) => [...new Set(types.map((t) => NODE_OF[t]).filter(Boolean))];

function withDocs(types: string[], body: string) {
  const docs = usedNodes(types).map((n) => NODE_DOCS[n]);
  return `${docs.length ? `${docs.join('\n\n')}\n\n` : ''}${body}\n`;
}

/** A numeric param is a float if any case passes it a non-integer (`myPow(x: float, n: int)`). */
const takesFloats = (spec: DsaSpec, i: number) =>
  spec.cases.some((c) => typeof c.input[i] === 'number' && !Number.isInteger(c.input[i]));

function functionStub(spec: DsaSpec): string {
  const params = spec.params ?? [];
  const returns = spec.returns ?? 'any';
  const args = ['self', ...params.map((p, i) => `${p.name}: ${pyType(p.type, takesFloats(spec, i))}`)].join(', ');
  const mutated = spec.returns === 'void' ? params[spec.mutates ?? 0]?.name : undefined;
  const body = mutated
    ? `        """\n        Do not return anything, modify ${mutated} in-place instead.\n        """\n        pass`
    : '        pass';
  return withDocs(
    [...params.map((p) => p.type), returns],
    `class Solution:\n    def ${spec.fn}(${args}) -> ${pyType(returns, spec.compare === 'float')}:\n${body}`,
  );
}

function designStub(spec: DsaSpec, jsStarter: string): string {
  const className = String((spec.cases[0]?.input as unknown[][] | undefined)?.[0]?.[0] ?? spec.fn);
  const methods = jsClassMethods(jsStarter);
  const defs = (methods.length ? methods : [{ name: 'constructor', params: [] }]).map(({ name, params }) => {
    const pyName = name === 'constructor' ? '__init__' : name;
    return `    def ${pyName}(${['self', ...params].join(', ')}):\n        pass`;
  });
  return `class ${className}:\n\n${defs.join('\n\n')}\n`;
}

function codecStub(spec: DsaSpec, jsStarter: string): string {
  const [encodeName, decodeName] = spec.methods ?? ['encode', 'decode'];
  const param = spec.params?.[0] ?? { name: 'value', type: 'any' };
  const returns = spec.returns ?? param.type;
  const fns = jsFunctions(jsStarter);
  const argOf = (fn: string, fallback: string) => fns.find((f) => f.name === fn)?.params[0] ?? fallback;
  const encodeArg = argOf(encodeName, param.name);
  const decodeArg = argOf(decodeName, 'data');
  return withDocs(
    [param.type, returns],
    `class Codec:\n    def ${encodeName}(self, ${encodeArg}: ${pyType(param.type, false)}) -> str:\n        pass\n\n` +
      `    def ${decodeName}(self, ${decodeArg}: str) -> ${pyType(returns, false)}:\n        pass`,
  );
}

/**
 * @param jsStarter the question's starter.js: design and codec questions take
 *   method and argument names from it, since cases.json doesn't describe them.
 */
export function pythonStub(spec: DsaSpec, jsStarter = ''): string {
  switch (spec.kind ?? 'function') {
    case 'design':
      return designStub(spec, jsStarter);
    case 'codec':
      return codecStub(spec, jsStarter);
    default:
      return functionStub(spec);
  }
}
