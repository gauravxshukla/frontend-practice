---
title: House Robber
type: dsa
difficulty: medium
topic: 1d-dp
order: 3
neetcode: true
tags: [dynamic-programming, arrays]
estimatedMinutes: 15
---

Houses stand in a row and `nums[i]` is the cash in house `i`. You may rob any set of houses as long as you **never rob two neighbouring houses**. Return the largest total you can collect.

```js
function rob(nums) // → number
```

## Examples

```text
Input:  nums = [1,2,3,1]
Output: 4
Explanation: Rob houses 0 and 2: 1 + 3 = 4.

Input:  nums = [2,7,9,3,1]
Output: 12
Explanation: Rob houses 0, 2 and 4: 2 + 9 + 1 = 12.
```

## Constraints

- 1 ≤ `nums.length` ≤ 100
- 0 ≤ `nums[i]` ≤ 400

## Notes

- **Identify:** maximise a sum without taking two neighbours → DP: rob this house or skip it
- **Key formula:** best(i) = max(best(i − 1), best(i − 2) + nums[i])
- **Brute force:** try every non-adjacent subset, O(2^n)
- **Insight:** each house only compares "skip it" with "rob it plus the best two houses back", so two variables suffice
- **Steps:** prev2 = prev1 = 0; for each house: cur = max(prev1, prev2 + house); shift the pair
- **Complexity:** O(2^n) → O(n) time, O(1) space
- **Pitfall:** don't assume alternating houses is optimal ([2, 1, 1, 2] → 4)
- **Related:** House Robber II, Climbing Stairs, Maximum Subarray
