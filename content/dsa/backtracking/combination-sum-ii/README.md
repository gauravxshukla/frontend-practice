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

- **Key insight:** sort first. Then, **at the same depth** of the recursion, skip a value equal to the one just tried. Each distinct value is chosen at most once per position, so duplicate combinations never appear.
- **Backtracking:** loop `i` from `start`. Skip when `i > start && c[i] === c[i - 1]`, stop when `c[i] > remaining`, and otherwise push and recurse with `(i + 1, remaining - c[i])`.
- The `i > start` part matters: it still lets you use two equal values *in the same combination* (`[1,1,6]`), and only blocks starting a new branch with the same value again.
- **Brute force:** generate all 2ⁿ subsets, keep those with the right sum, and dedupe by sorted key. Correct, but hopeless for inputs like thirty 1s, where it explores about 10⁹ subsets.
- **Alternative:** group equal values with counts, then choose how many copies (0..count) of each distinct value to use.
- Complexity: O(2ⁿ · n) worst case, but pruning and the sorted break keep it much smaller in practice.
- Pitfall: deduping afterwards with a Set of strings. It works, but it still does all the exponential duplicate work.
- Follow-up: compare with Subsets II, which uses the same "skip equal values at the same depth" trick.
