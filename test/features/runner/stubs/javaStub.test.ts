import { describe, expect, it } from 'vitest';
import type { DsaSpec } from '../../../../src/lib/content/catalog';
import { cleanCompilerOutput, JAVA_IMPORTS, prepareJavaRun } from '../../../../src/features/runner/java/prepare.js';
import { javaStub } from '../../../../src/features/runner/stubs/javaStub';

const fn = (over: Partial<DsaSpec>): DsaSpec => ({ fn: 'f', params: [], returns: 'number', cases: [], ...over });

describe('javaStub', () => {
  it('writes a Solution method with LeetCode types and a compiling default return', () => {
    const spec = fn({
      fn: 'twoSum',
      params: [
        { name: 'nums', type: 'number[]' },
        { name: 'target', type: 'number' },
      ],
      returns: 'number[]',
      cases: [{ input: [[2, 7], 9], expected: [0, 1] }],
    });
    expect(javaStub(spec)).toBe(
      'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Your code here\n        return null;\n    }\n}\n',
    );
  });

  it('infers long and double from the case data', () => {
    const spec = fn({
      fn: 'g',
      params: [
        { name: 'big', type: 'number' },
        { name: 'x', type: 'number' },
      ],
      cases: [{ input: [3_000_000_000, 2.5], expected: 1 }],
    });
    expect(javaStub(spec)).toContain('public int g(long big, double x)');
    expect(javaStub({ ...spec, compare: 'float' })).toContain('public double g(');
  });

  it('uses List<List<Integer>> for unordered or jagged results and int[][] for uniform rows', () => {
    const grid = (expected: unknown, compare = 'exact') =>
      javaStub(fn({ returns: 'number[][]', compare, cases: [{ input: [], expected }] }));
    expect(grid([[1, 2], [3, 4]])).toContain('public int[][] f()');
    expect(grid([[1], [2, 3]])).toContain('public List<List<Integer>> f()');
    expect(grid([[1, 2]], 'unordered-deep')).toContain('public List<List<Integer>> f()');
  });

  it('marks in-place questions and documents node classes', () => {
    const stub = javaStub(fn({ fn: 'reorderList', params: [{ name: 'head', type: 'ListNode' }], returns: 'void', mutates: 0 }));
    expect(stub).toMatch(/^\/\*\*\n \* Definition for singly-linked list\./);
    expect(stub).toContain('public void reorderList(ListNode head) {\n        // Your code here (modify head in place)\n    }');
  });

  it('types design classes from the cases and names from the JS starter', () => {
    const spec: DsaSpec = {
      fn: 'KthLargest',
      kind: 'design',
      cases: [{ input: [['KthLargest', 'add', 'add'], [[3, [4, 5]], [3], [5]]], expected: [null, 4, 5] }],
    };
    const js = 'export default class KthLargest {\n  constructor(k, nums) {}\n\n  add(val) {\n  }\n}\n';
    const stub = javaStub(spec, js);
    expect(stub).toContain('public KthLargest(int k, int[] nums) {');
    expect(stub).toContain('public int add(int val) {');
  });

  it('writes a Codec with List<String> like LeetCode', () => {
    const spec = fn({ kind: 'codec', methods: ['encode', 'decode'], params: [{ name: 'strs', type: 'string[]' }], returns: 'string[]' });
    const stub = javaStub(spec, 'function encode(strs) {}\nfunction decode(encoded) {}');
    expect(stub).toContain('public String encode(List<String> strs) {');
    expect(stub).toContain('public List<String> decode(String encoded) {');
  });
});

describe('prepareJavaRun', () => {
  const nodes = { ListNode: 'class ListNode {}', TreeNode: 'class TreeNode {}', GraphNode: 'class Node {}', RandomNode: 'class Node { Node random; }' };
  const listSpec = { params: [{ type: 'ListNode' }], returns: 'ListNode' };

  it('puts LeetCode’s imports on line 1 so line numbers still match the editor', () => {
    const files = prepareJavaRun('class Solution {}\n', { params: [], returns: 'number' }, nodes);
    expect(files['Solution.java']).toBe(`${JAVA_IMPORTS}class Solution {}\n`);
    expect(files['Solution.java'].split('\n')).toHaveLength(2);
  });

  it('adds only the node classes the question uses, and the right Node variant', () => {
    expect(Object.keys(prepareJavaRun('class Solution {}', listSpec, nodes))).toEqual(['Solution.java', 'ListNode.java']);
    expect(prepareJavaRun('', { params: [{ type: 'RandomListNode' }] }, nodes)['Node.java']).toBe(nodes.RandomNode);
    expect(prepareJavaRun('', { params: [{ type: 'GraphNode' }] }, nodes)['Node.java']).toBe(nodes.GraphNode);
  });

  it('lets the user’s own node class win, ignoring commented-out definitions', () => {
    expect(prepareJavaRun('class ListNode { int val; }\nclass Solution {}', listSpec, nodes)['ListNode.java']).toBeUndefined();
    expect(prepareJavaRun('/**\n * public class ListNode {\n */\nclass Solution {}', listSpec, nodes)['ListNode.java']).toBeDefined();
  });

  it('trims sandbox paths from javac output', () => {
    expect(cleanCompilerOutput('/str/Solution.java:3: error: x\n/tmp/a/b/ListNode.java:1: error: y\n')).toBe(
      'Solution.java:3: error: x\nListNode.java:1: error: y',
    );
  });
});
