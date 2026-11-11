import { describe, expect, it } from 'vitest';
import type { DsaSpec } from '../../../../src/lib/content/catalog';
import { jsClassMethods, pythonStub } from '../../../../src/features/runner/stubs/pythonStub';

describe('pythonStub', () => {
  it('writes a Solution method with typed params', () => {
    const spec: DsaSpec = {
      fn: 'twoSum',
      params: [
        { name: 'nums', type: 'number[]' },
        { name: 'target', type: 'number' },
      ],
      returns: 'number[]',
      cases: [{ input: [[2, 7], 9], expected: [0, 1] }],
    };
    expect(pythonStub(spec)).toBe(
      'class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        pass\n',
    );
  });

  it('infers float params from the cases and float returns from the compare mode', () => {
    const spec: DsaSpec = {
      fn: 'myPow',
      params: [
        { name: 'x', type: 'number' },
        { name: 'n', type: 'number' },
      ],
      returns: 'number',
      compare: 'float',
      cases: [{ input: [2.1, 3], expected: 9.261 }],
    };
    expect(pythonStub(spec)).toContain('def myPow(self, x: float, n: int) -> float:');
  });

  it('documents node classes and in-place questions like LeetCode', () => {
    const spec: DsaSpec = {
      fn: 'reorderList',
      params: [{ name: 'head', type: 'ListNode' }],
      returns: 'void',
      mutates: 0,
      cases: [],
    };
    const stub = pythonStub(spec);
    expect(stub).toMatch(/^# Definition for singly-linked list\./);
    expect(stub).toContain('def reorderList(self, head: Optional[ListNode]) -> None:');
    expect(stub).toContain('Do not return anything, modify head in-place instead.');
  });

  it('builds design classes from the JS starter’s methods', () => {
    const spec: DsaSpec = { fn: 'LRUCache', kind: 'design', cases: [{ input: [['LRUCache', 'get'], [[2], [1]]] }] };
    const js = 'export default class LRUCache {\n  constructor(capacity) {}\n\n  get(key) {\n  }\n\n  put(key, value) {\n  }\n}\n';
    expect(pythonStub(spec, js)).toBe(
      'class LRUCache:\n\n    def __init__(self, capacity):\n        pass\n\n    def get(self, key):\n        pass\n\n    def put(self, key, value):\n        pass\n',
    );
  });

  it('builds a Codec with the spec’s method names', () => {
    const spec: DsaSpec = {
      fn: 'Codec',
      kind: 'codec',
      methods: ['serialize', 'deserialize'],
      params: [{ name: 'root', type: 'TreeNode' }],
      returns: 'TreeNode',
      cases: [],
    };
    const js = 'function serialize(root) {}\nfunction deserialize(data) {}\nexport default { serialize, deserialize };';
    const stub = pythonStub(spec, js);
    expect(stub).toContain('class Codec:\n    def serialize(self, root: Optional[TreeNode]) -> str:');
    expect(stub).toContain('def deserialize(self, data: str) -> Optional[TreeNode]:');
  });
});

describe('jsClassMethods', () => {
  it('reads methods and drops default values, ignoring control flow', () => {
    expect(jsClassMethods('class A {\n  constructor(k, nums = []) {}\n  add(val) {\n    if (x) {}\n  }\n}')).toEqual([
      { name: 'constructor', params: ['k', 'nums'] },
      { name: 'add', params: ['val'] },
    ]);
  });
});
