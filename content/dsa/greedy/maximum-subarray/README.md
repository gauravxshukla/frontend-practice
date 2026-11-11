---
title: Maximum Subarray
type: dsa
difficulty: medium
topic: greedy
order: 1
neetcode: true
tags: [arrays, greedy, dynamic-programming, kadane]
estimatedMinutes: 15
---

You get a non-empty array of integers `nums`. Find the contiguous slice (at least one element long) whose elements add up to the largest total, and return that total.

Values can be negative, so the best slice may be a single element.

```js
function maxSubArray(nums) // → number
```

## Examples

```text
Input:  nums = [-2,1,-3,4,-1,2,1,-5,4]
Output: 6
Explanation: The slice [4,-1,2,1] sums to 6.

Input:  nums = [1]
Output: 1

Input:  nums = [5,4,-1,7,8]
Output: 23
Explanation: Taking the whole array gives 23.
```

## Constraints

- 1 ≤ `nums.length` ≤ 10⁵
- −10⁴ ≤ `nums[i]` ≤ 10⁴

## Notes

- **Identify:** largest sum of a contiguous subarray → Kadane: best sum ending at each index
- **Brute force:** sum every subarray, O(n²)
- **Insight:** a negative running sum only drags the next element down, so drop it and start fresh
- **Steps:** current = max(n, current + n); best = max(best, current)
- **Complexity:** O(n²) → O(n) time, O(1) space
- **Pitfall:** start best at nums[0], not 0, so an all-negative array returns its largest element
- **Related:** Maximum Product Subarray, Best Time to Buy and Sell Stock, House Robber
