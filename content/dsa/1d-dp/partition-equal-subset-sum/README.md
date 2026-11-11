---
title: Partition Equal Subset Sum
type: dsa
difficulty: medium
topic: 1d-dp
order: 12
neetcode: true
tags: [dynamic-programming, knapsack, arrays]
estimatedMinutes: 25
---

Given an array of positive integers, decide whether it can be split into **two groups with equal sums**. Every element goes into exactly one group. Return `true` or `false`.

```js
function canPartition(nums) // → boolean
```

## Examples

```text
Input:  nums = [1,5,11,5]
Output: true
Explanation: [1, 5, 5] and [11] both sum to 11.

Input:  nums = [1,2,3,5]
Output: false
Explanation: The total 11 is odd.
```

## Constraints

- 1 ≤ `nums.length` ≤ 200
- 1 ≤ `nums[i]` ≤ 100

## Notes

- **Identify:** split into two equal-sum halves → is there a subset summing to total / 2 (0/1 knapsack)
- **Key formula:** can[s] |= can[s − num], iterating s downward for each num
- **Brute force:** try every subset, O(2^n)
- **Insight:** only reachable sums up to total / 2 matter; a boolean array of sums replaces the subsets
- **Steps:** odd total → false; can[0] = true; for each num, for s from target down to num: can[s] ||= can[s − num]
- **Complexity:** O(2^n) → O(n · target) time, O(target) space
- **Pitfall:** loop s downward, or one number gets counted twice in the same pass
- **Related:** Target Sum, Coin Change, Subsets
