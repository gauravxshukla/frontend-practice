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

- **Key insight:** build each combination in a fixed order (only candidates at index ≥ the last one used). Then each multiset is generated exactly once.
- **Backtracking:** `backtrack(start, remaining)`. At 0, record a copy. Otherwise loop `i` from `start`, push `candidates[i]`, and recurse with `(i, remaining - candidates[i])`. Passing `i` again is what allows reuse.
- **Pruning:** sort the candidates first and `break` once `candidates[i] > remaining`, since every later candidate is bigger too.
- Complexity: exponential. A loose bound is O(n^(t/m)), where t is the target and m is the smallest candidate. Recursion depth is at most t/m.
- **Alternative brute force:** for each candidate, try every count from 0 up to `remaining / c`.
- Pitfall: looping from 0 at every level, which produces `[2,2,3]`, `[2,3,2]` and `[3,2,2]` as separate answers.
- Pitfall: recursing with `i + 1`, which forbids reuse (that's Combination Sum II).
- Follow-up: count the combinations instead of listing them. That's the Coin Change II DP, O(n · target).
