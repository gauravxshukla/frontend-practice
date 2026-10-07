---
title: Subsets II
type: dsa
difficulty: medium
topic: backtracking
order: 5
neetcode: true
tags: [backtracking, arrays, sorting, recursion]
estimatedMinutes: 20
---

You get an array `nums` of integers that **may contain duplicates**. Return every possible subset, but list each distinct subset only **once**. For example, `[1,2]` built from either of two equal 2s counts as one subset. Return the subsets in any order, with numbers inside each subset in any order.

```js
function subsetsWithDup(nums) // → number[][]
```

## Examples

```text
Input:  nums = [1,2,2]
Output: [[],[1],[1,2],[1,2,2],[2],[2,2]]

Input:  nums = [0]
Output: [[],[0]]
```

## Constraints

- 1 ≤ `nums.length` ≤ 10
- −10 ≤ `nums[i]` ≤ 10

## Notes

- **Key insight:** sort so equal values sit next to each other. Then, at any depth, start a branch with a given value only once.
- **Backtracking:** record a copy of the path at every call. Loop `i` from `start`, `continue` when `i > start && nums[i] === nums[i - 1]`, otherwise push, recurse on `i + 1`, and pop. O(n · 2ⁿ) time worst case.
- **Iterative alternative:** like Subsets, but when the current number equals the previous one, only extend the subsets created in the previous round.
- **Count-based alternative:** group into `(value, count)` pairs and choose 0..count copies of each value.
- **Brute force:** generate all 2ⁿ subsets, sort each one, and dedupe through a Set of keys. Correct, but it repeats work and allocates heavily.
- Pitfall: forgetting to sort first. The skip check only works on adjacent duplicates.
- Pitfall: skipping with `i > 0` instead of `i > start`, which wrongly blocks `[2,2]`.
- Follow-up: Combination Sum II uses exactly the same dedupe rule.
