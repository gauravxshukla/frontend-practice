---
title: Longest Consecutive Sequence
type: dsa
difficulty: medium
topic: arrays-hashing
order: 9
neetcode: true
tags: [arrays, hash-set]
estimatedMinutes: 20
---

You get an unsorted integer array `nums`. Return the length of the longest run of **consecutive integers** (like 4, 5, 6, 7) whose values all appear somewhere in `nums`. The values don't need to be next to each other in the array, and duplicates count once. An empty array gives `0`.

Aim for O(n) time.

```js
function longestConsecutive(nums) // → number
```

## Examples

```text
Input:  nums = [100,4,200,1,3,2]
Output: 4
Explanation: 1, 2, 3, 4 are all present.

Input:  nums = [0,3,7,2,5,8,4,6,0,1]
Output: 9
Explanation: 0 through 8.
```

## Constraints

- 0 ≤ `nums.length` ≤ 10⁵
- −10⁹ ≤ `nums[i]` ≤ 10⁹

## Notes

- **Key insight:** put everything in a `Set`. A number `n` *starts* a run exactly when `n - 1` is not in the set.
- For each run start, count upward (`n + 1`, `n + 2`, …) while the values are present, and keep the best length.
- O(n) time overall: each number is visited by the counting loop at most once, because only run starts trigger counting. O(n) space.
- **Baseline:** sort, then scan and count runs while skipping duplicates. O(n log n), simple and often acceptable.
- Pitfall: counting from *every* number instead of only run starts makes it O(n²) on input like `[1..n]`.
- Pitfall: duplicates. With sorting, `[1,2,2,3]` must still give 3. Iterate the set, not the array, to skip repeats for free.
- Pitfall: an empty input must return 0, not 1.
- Follow-up: a union-find over value neighbours also works, and generalizes to a stream of insertions.
