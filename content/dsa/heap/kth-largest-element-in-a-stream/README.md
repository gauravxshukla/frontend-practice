---
title: Kth Largest Element in a Stream
type: dsa
difficulty: easy
topic: heap
order: 1
neetcode: true
tags: [design, heap, priority-queue]
estimatedMinutes: 15
---

Build a `KthLargest` class that tracks the **k-th largest** value in a stream of numbers (k-th largest in sorted order, so duplicates count separately).

- `new KthLargest(k, nums)` starts with `k` and an initial list of values `nums`.
- `add(val)` adds `val` to the stream and returns the current k-th largest value.

Every call to `add` is guaranteed to happen when at least `k` values have been seen (including the new one).

```js
class KthLargest {
  add(val) // → number
}
```

## Examples

The judge calls the methods in order. `operations[i]` is called with `arguments[i]`, and the output lists each call's return value (`null` for the constructor).

```text
Input:
  operations = ["KthLargest","add","add","add","add","add"]
  arguments  = [[3,[4,5,8,2]],[3],[5],[10],[9],[4]]
Output: [null,4,5,5,8,8]
Explanation: after add(3) the values are [2,3,4,5,8] and the 3rd largest is 4.

Input:
  operations = ["KthLargest","add","add","add"]
  arguments  = [[1,[]],[-3],[-2],[-4]]
Output: [null,-3,-2,-2]
```

## Constraints

- 1 ≤ `k` ≤ 10⁴
- 0 ≤ `nums.length` ≤ 10⁴
- −10⁴ ≤ `nums[i]`, `val` ≤ 10⁴
- At most 10⁴ calls to `add`.

## Notes

- **Key insight:** you only care about the top k values. Keep them in a **min-heap of size k**. Its root is the smallest of the top k, which is exactly the k-th largest.
- On `add`: push the value, and if the heap grows past k, pop the minimum. Return the root.
- Initialise by running the same logic over `nums`.
- O(log k) per `add`, O(n log k) to build, O(k) space.
- Brute force: keep a sorted array and insert with binary search. Insertion still shifts elements, so it's O(n) per add.
- JS has no built-in heap, so write a small one (array-backed, sift up/down). Interviewers expect you to be able to.
- Pitfall: using a max-heap of everything, then popping k times per query, which is O(k log n) per add.
- Edge cases: empty initial `nums`, duplicates, negative values, k = 1.
- Follow-up: support removals, or the k-th largest in a sliding window (needs two heaps or an ordered set with lazy deletion).
