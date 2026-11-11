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

- **Identify:** k-th largest as numbers keep arriving → min-heap holding only the k largest
- **Brute force:** keep a sorted list and insert each new number in place, O(n) per add
- **Insight:** the k-th largest is the smallest of the top k, so a size-k min-heap has it on top
- **Steps:** push each number; if the heap holds more than k, pop the smallest; the top is the answer
- **Complexity:** O(n) → O(log k) per add, O(k) space
- **Pitfall:** the starting array can have fewer than k numbers, so only trim when size exceeds k
- **Related:** Kth Largest Element in an Array, Last Stone Weight, Find Median from Data Stream
