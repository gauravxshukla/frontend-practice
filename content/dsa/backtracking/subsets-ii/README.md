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

- **Identify:** every subset when the input has duplicates → sort + backtrack + skip repeats at a depth
- **Brute force:** generate all 2^n subsets of the sorted input and dedupe with a set
- **Insight:** record the path at every node; at one depth, start a branch with each distinct value only once
- **Steps:** sort; dfs(start): save path; for i from start, skip i > start with nums[i] == nums[i − 1]; add, recurse at i + 1, pop
- **Complexity:** O(n·2^n) time, O(n) recursion depth
- **Pitfall:** sort first, or equal values aren't adjacent and the skip misses them
- **Related:** Subsets, Combination Sum II, Permutations
