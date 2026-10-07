---
title: Subsets
type: dsa
difficulty: medium
topic: backtracking
order: 1
neetcode: true
tags: [backtracking, arrays, recursion, bit-manipulation]
estimatedMinutes: 15
---

You get an array `nums` of **distinct** integers. Return every possible subset (the power set), including the empty subset and `nums` itself. Don't include the same subset twice. You can return the subsets in any order, and the numbers inside each subset in any order.

```js
function subsets(nums) // → number[][]
```

## Examples

```text
Input:  nums = [1,2,3]
Output: [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]

Input:  nums = [0]
Output: [[],[0]]
```

## Constraints

- 1 ≤ `nums.length` ≤ 10
- −10 ≤ `nums[i]` ≤ 10
- All values in `nums` are distinct

## Notes

- **Key insight:** each element is either in a subset or not, so there are exactly 2ⁿ subsets, and a binary decision tree of depth n produces all of them.
- **Backtracking:** `backtrack(i)` first skips `nums[i]` and then takes it (push, recurse, pop). At `i === n`, record a **copy** of the current path. O(n · 2ⁿ) time (2ⁿ subsets, each up to n long to copy), O(n) recursion depth.
- **"For-loop" form:** record the path at every call, then loop `j` from `start` to `n - 1` and recurse with `j + 1`. This is the template that extends to Subsets II and Combination Sum.
- **Iterative:** start with `[[]]` and, for each number, add a copy of every existing subset with that number appended.
- **Bitmask:** for `mask` from 0 to 2ⁿ − 1, take the elements whose bits are set.
- Pitfall: pushing `path` itself instead of `[...path]`. Every entry ends up pointing to the same (eventually empty) array.
- The output size is already exponential, so no algorithm can beat O(n · 2ⁿ).
- Follow-up: Subsets II, where `nums` has duplicates and duplicate subsets must be skipped.
