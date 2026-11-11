---
title: Permutations
type: dsa
difficulty: medium
topic: backtracking
order: 4
neetcode: true
tags: [backtracking, arrays, recursion]
estimatedMinutes: 15
---

You get an array `nums` of **distinct** integers. Return every possible ordering (permutation) of the numbers. You can return the permutations in any order, but the order of numbers **inside** each permutation is the permutation, so it matters.

```js
function permute(nums) // → number[][]
```

## Examples

```text
Input:  nums = [1,2,3]
Output: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]

Input:  nums = [0,1]
Output: [[0,1],[1,0]]

Input:  nums = [1]
Output: [[1]]
```

## Constraints

- 1 ≤ `nums.length` ≤ 6
- −10 ≤ `nums[i]` ≤ 10
- All values in `nums` are distinct

## Notes

- **Identify:** every ordering of distinct numbers → backtracking with a "used" marker
- **Brute force:** generate all n^n sequences and keep those with no repeats
- **Insight:** fill one position at a time with any number not yet used on this path
- **Steps:** dfs(): if path has n items save it; else for each unused num: mark, add, recurse, remove, unmark
- **Complexity:** O(n^n) → O(n·n!) time, O(n) space besides the output
- **Pitfall:** unmark after recursing, or later branches think the number is still taken
- **Related:** Subsets, Combination Sum, N-Queens
