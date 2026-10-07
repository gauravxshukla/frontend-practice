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

- **Key insight (Kadane):** a running sum that has gone negative can only hurt whatever comes next, so drop it and start fresh at the current element.
- Track `current = max(n, current + n)` and `best = max(best, current)` in one pass.
- O(n) time, O(1) space. The brute force tries every (i, j) pair with a running sum: O(n²).
- Initialise `best` with `nums[0]` (or `-Infinity`), not `0`. Otherwise an all-negative array wrongly returns 0.
- Equivalent DP view: `dp[i]` = best sum of a slice ending at `i`, and `dp[i] = nums[i] + max(dp[i-1], 0)`.
- Divide and conquer also works in O(n log n): the best slice is in the left half, the right half, or crosses the middle.
- Follow-up: return the slice indices too. Remember where `current` was last reset.
- Follow-up: the circular version (Maximum Sum Circular Subarray) uses `total − minimum subarray`.
