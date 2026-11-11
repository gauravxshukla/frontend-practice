---
title: Combination Sum
type: dsa
difficulty: medium
topic: backtracking
order: 2
neetcode: true
tags: [backtracking, arrays, recursion]
estimatedMinutes: 20
---

You get an array `candidates` of **distinct** positive integers and a positive `target`. Return every unique combination of candidates that adds up to `target`. You may use **the same number any number of times**. Two combinations are the same if they use each number the same number of times, so `[2,2,3]` and `[3,2,2]` count once. Return the combinations in any order, with numbers inside each one in any order. If nothing works, return `[]`.

```js
function combinationSum(candidates, target) // → number[][]
```

## Examples

```text
Input:  candidates = [2,3,6,7], target = 7
Output: [[2,2,3],[7]]

Input:  candidates = [2,3,5], target = 8
Output: [[2,2,2,2],[2,3,3],[3,5]]

Input:  candidates = [2], target = 1
Output: []
```

## Constraints

- 1 ≤ `candidates.length` ≤ 30
- 2 ≤ `candidates[i]` ≤ 40 in the original problem (these tests also include 1), all distinct
- 1 ≤ `target` ≤ 40

## Notes

- **Identify:** combinations summing to target, numbers reusable → backtracking with a start index
- **Brute force:** generate every multiset of candidates up to target and keep the matches
- **Insight:** pass a start index so each combination is built in one order, and stay at i to reuse it
- **Steps:** dfs(start, remaining): 0 → save path; for i from start: if candidates[i] ≤ remaining, add it and recurse at i
- **Complexity:** O(n^(target/min)) time in the worst case, O(target/min) recursion depth
- **Pitfall:** recursing from 0 instead of i produces the same combination in different orders
- **Related:** Combination Sum II, Subsets, Coin Change II
