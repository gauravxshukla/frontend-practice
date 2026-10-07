---
title: 3Sum
type: dsa
difficulty: medium
topic: two-pointers
order: 3
neetcode: true
tags: [arrays, two-pointers, sorting]
estimatedMinutes: 25
---

You get an integer array `nums`. Return every **distinct** triplet of values `[a, b, c]`, taken from three different positions, where `a + b + c = 0`.

The same triplet of values must not appear twice. The triplets can come back in any order, and so can the values inside each triplet. If there are none, return `[]`.

```js
function threeSum(nums) // → number[][]
```

## Examples

```text
Input:  nums = [-1,0,1,2,-1,-4]
Output: [[-1,0,1],[-1,-1,2]]

Input:  nums = [0,1,1]
Output: []

Input:  nums = [0,0,0]
Output: [[0,0,0]]
```

## Constraints

- 3 ≤ `nums.length` ≤ 3000
- −10⁵ ≤ `nums[i]` ≤ 10⁵

## Notes

- **Key insight:** sort first. Then fix the smallest value `nums[i]` and solve Two Sum II for `-nums[i]` on the part to its right with two pointers.
- Skip duplicate anchors: if `nums[i] === nums[i - 1]`, continue. After recording a triplet, move `left` forward past equal values.
- Early exit: once `nums[i] > 0`, no triplet can sum to zero.
- O(n²) time. O(1) extra space beyond the output (or O(n) if you copy before sorting so you don't mutate the input).
- **Baseline:** three nested loops plus a set of sorted-triplet keys is O(n³), too slow for 3000 elements.
- **Hash-set variant:** for each `i`, run the Two Sum hash approach on the rest. It's also O(n²) but deduplication is messier.
- Pitfall: deduplicating with a set of stringified triplets *after* finding them works but hides the real skip logic interviewers look for.
- Pitfall: only skipping duplicates of `left` *after* a match. Skipping on every move is fine but not required.
- Follow-up: 4Sum / kSum. Recurse down to the two-pointer base case for O(n^(k−1)).
