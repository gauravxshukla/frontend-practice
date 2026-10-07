---
title: Find the Duplicate Number
type: dsa
difficulty: medium
topic: linked-list
order: 8
neetcode: true
tags: [arrays, fast-slow-pointers, cycle-detection]
estimatedMinutes: 25
---

You get an array `nums` of `n + 1` integers where every value is between `1` and `n` inclusive. Exactly one value is repeated (it may appear two or more times); return that value.

The challenge: **don't modify** `nums`, and use only O(1) extra space.

```js
function findDuplicate(nums) // → number
```

## Examples

```text
Input:  nums = [1,3,4,2,2]
Output: 2

Input:  nums = [3,1,3,4,2]
Output: 3

Input:  nums = [3,3,3,3,3]
Output: 3
```

## Constraints

- 1 ≤ n ≤ 10⁵, and `nums.length === n + 1`
- 1 ≤ `nums[i]` ≤ n
- Exactly one value repeats, possibly many times.

## Notes

- **Key insight:** read the array as a linked list where index `i` points to index `nums[i]`. Index 0 is never a target (values start at 1), so it's a clean entry point. Two indices point at the duplicate value, which creates a cycle whose entrance **is** the duplicate.
- Phase 1 (Floyd): move `slow = nums[slow]` and `fast = nums[nums[fast]]` until they meet inside the cycle.
- Phase 2: reset `slow` to the start and step both one at a time. Where they meet is the cycle entrance, so return it.
- O(n) time, O(1) space, and the array is untouched.
- Baselines: a `Set` gives O(n) time and O(n) space. Sorting a copy gives O(n log n). Neither meets the constraints.
- Alternative within the rules: binary search on the value range, counting how many numbers are `<= mid` (pigeonhole). O(n log n) time, O(1) space.
- Pitfall: marking visited entries by negating values is O(1) space but **modifies** the input, which this problem forbids.
- Edge cases: the duplicate appears many times, or the smallest array `[1,1]`.
