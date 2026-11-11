---
title: House Robber II
type: dsa
difficulty: medium
topic: 1d-dp
order: 4
neetcode: true
tags: [dynamic-programming, arrays]
estimatedMinutes: 20
---

Same rules as House Robber (never rob two neighbouring houses), but now the houses sit in a **circle**: the first house and the last house are neighbours too. `nums[i]` is the cash in house `i`. Return the largest total you can collect.

```js
function rob(nums) // → number
```

## Examples

```text
Input:  nums = [2,3,2]
Output: 3
Explanation: Houses 0 and 2 are neighbours in the circle, so the best is house 1 alone.

Input:  nums = [1,2,3,1]
Output: 4
Explanation: Rob houses 0 and 2: 1 + 3 = 4.

Input:  nums = [1,2,3]
Output: 3
```

## Constraints

- 1 ≤ `nums.length` ≤ 100
- 0 ≤ `nums[i]` ≤ 1000

## Notes

- **Identify:** House Robber on a circle (first and last are neighbours) → solve two straight lines
- **Brute force:** try every non-adjacent subset that avoids taking both ends, O(2^n)
- **Insight:** the first and last can't both be robbed, so take the better of houses [0..n−2] and [1..n−1]
- **Steps:** run linear House Robber without the last house, then without the first; return the max
- **Complexity:** O(2^n) → O(n) time, O(1) space
- **Pitfall:** a single house can't be split into two ranges: return nums[0] directly
- **Related:** House Robber, Climbing Stairs, Maximum Product Subarray
