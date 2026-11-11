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

- **Identify:** longest run of consecutive values, unsorted, O(n) required → hash set
- **Brute force:** sort, then count runs while skipping duplicates, O(n log n)
- **Insight:** only start counting from a run's first value: a num whose `num − 1` isn't in the set
- **Steps:** put nums in a set; for each run start, walk num + 1, num + 2… while present; keep the longest
- **Complexity:** O(n log n) → O(n) time, O(1) → O(n) space
- **Pitfall:** loop over the set, not nums, or many duplicate run starts repeat the same walk
- **Related:** Contains Duplicate, Top K Frequent Elements, Two Sum
