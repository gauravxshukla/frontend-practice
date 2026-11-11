---
title: Target Sum
type: dsa
difficulty: medium
topic: 2d-dp
order: 5
neetcode: true
tags: [dynamic-programming, knapsack, backtracking]
estimatedMinutes: 25
---

Put a `+` or a `-` sign in front of **every** number in `nums`, then add everything up. Return how many of the 2ⁿ sign assignments make the result equal `target`. Assignments are counted by position, so equal numbers at different indices give different assignments.

```js
function findTargetSumWays(nums, target) // → number
```

## Examples

```text
Input:  nums = [1,1,1,1,1], target = 3
Output: 5
Explanation: Make exactly one of the five 1s negative: 5 ways.

Input:  nums = [1], target = 1
Output: 1
```

## Constraints

- 1 ≤ `nums.length` ≤ 20
- 0 ≤ `nums[i]` ≤ 1000, and `sum(nums)` ≤ 1000
- −1000 ≤ `target` ≤ 1000

## Notes

- **Identify:** assign + or − to reach a target → count subsets summing to (total + target) / 2
- **Key formula:** positives − negatives = target and positives + negatives = total ⇒ positives = (total + target) / 2
- **Brute force:** try both signs for every number, O(2^n)
- **Better:** memoise (index, running sum), O(n · total) time and space
- **Insight:** choosing the + numbers is a subset-sum count, which a 1-D array solves
- **Steps:** if |target| > total or (total + target) is odd return 0; ways[0] = 1; for each num, for s downward: ways[s] += ways[s − num]
- **Complexity:** O(2^n) → O(n · total) time, O(total) space
- **Pitfall:** zeros double the count (±0), which the loop handles when s goes down to num inclusive
- **Related:** Partition Equal Subset Sum, Coin Change II, Subsets
