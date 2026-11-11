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

- **Identify:** every subset of distinct numbers → backtracking: include or skip each element
- **Brute force:** loop over all 2^n bitmasks and build each subset, same O(n·2^n) but less general
- **Insight:** each element is a yes/no choice; recurse on both, sharing one path array
- **Steps:** dfs(i): at i = n save a copy of the path; else include nums[i] and recurse, pop, then recurse without it
- **Complexity:** O(n·2^n) time, O(n) recursion space besides the output
- **Pitfall:** save a copy of the path, not the path itself, since it keeps changing
- **Related:** Subsets II, Combination Sum, Permutations
