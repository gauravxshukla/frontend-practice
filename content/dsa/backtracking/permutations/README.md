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

- **Key insight:** fill positions one at a time. Each position can take any number not already used, which gives n · (n−1) · … · 1 = n! leaves.
- **Backtracking with a `used` array:** loop over all indices, skip used ones, then mark, push, recurse, pop and unmark. Record a copy when the path has length n. O(n · n!) time, O(n) extra space.
- **Swap-based:** at depth `d`, swap each `j ≥ d` into position `d`, recurse on `d + 1`, and swap back. This avoids the `used` array.
- **Insertion (iterative):** start from `[[]]`, and for each number, insert it at every position of every existing permutation.
- Pitfall: using `path.includes(x)` to check membership. It works for distinct values but costs O(n) per check, and it breaks when values repeat.
- Pitfall: forgetting to copy `path` when recording, or forgetting to un-mark `used[i]` on the way back.
- Follow-up: Permutations II, with duplicates. Sort, then skip `nums[i]` if it equals `nums[i-1]` and `nums[i-1]` isn't currently used.
- Follow-up: Next Permutation, which finds the next ordering in O(n) without generating all of them.
