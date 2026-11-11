---
title: Combination Sum II
type: dsa
difficulty: medium
topic: backtracking
order: 3
neetcode: true
tags: [backtracking, arrays, sorting, recursion]
estimatedMinutes: 20
---

You get an array `candidates` of positive integers, which **may contain duplicates**, and a positive `target`. Return every unique combination that adds up to `target`, where each array element can be used **at most once**. The result must not contain the same combination twice, even if equal values come from different positions. Return the combinations in any order, with numbers inside each one in any order.

```js
function combinationSum2(candidates, target) // → number[][]
```

## Examples

```text
Input:  candidates = [10,1,2,7,6,1,5], target = 8
Output: [[1,1,6],[1,2,5],[1,7],[2,6]]

Input:  candidates = [2,5,2,1,2], target = 5
Output: [[1,2,2],[5]]
```

## Constraints

- 1 ≤ `candidates.length` ≤ 100
- 1 ≤ `candidates[i]` ≤ 50
- 1 ≤ `target` ≤ 30

## Notes

- **Identify:** combinations summing to target, each number used once, input has duplicates → sort + backtrack + skip repeats
- **Brute force:** generate every subset, keep those summing to target, dedupe with a set, O(n·2^n)
- **Insight:** after sorting, equal values are adjacent; at one depth, try each distinct value only once
- **Steps:** sort; dfs(start, remaining): for i from start, skip i > start with candidates[i] == candidates[i − 1]; recurse at i + 1
- **Complexity:** O(n·2^n) time worst case, O(n) recursion depth
- **Pitfall:** skip duplicates only at the same depth (i > start), not along a path, or [1, 1, 6] is lost
- **Related:** Combination Sum, Subsets II, Permutations
