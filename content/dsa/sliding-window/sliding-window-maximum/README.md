---
title: Sliding Window Maximum
type: dsa
difficulty: hard
topic: sliding-window
order: 6
neetcode: true
tags: [arrays, sliding-window, monotonic-deque, heap]
estimatedMinutes: 30
---

You get an integer array `nums` and a window size `k`. A window of `k` consecutive elements starts at the left and moves right by one position at a time until it reaches the end. Return an array with the **maximum** of each window, in order. There are `nums.length − k + 1` windows.

```js
function maxSlidingWindow(nums, k) // → number[]
```

## Examples

```text
Input:  nums = [1,2,1,0,4,2,6], k = 3
Output: [2,2,4,4,6]
Explanation: windows [1,2,1] [2,1,0] [1,0,4] [0,4,2] [4,2,6].

Input:  nums = [1,3,-1,-3,5,3,6,7], k = 3
Output: [3,3,5,5,6,7]
```

## Constraints

- 1 ≤ `nums.length` ≤ 10⁵
- −10⁴ ≤ `nums[i]` ≤ 10⁴
- 1 ≤ `k` ≤ `nums.length`

## Notes

- **Identify:** max of every window of size k → monotonic decreasing deque of indices
- **Brute force:** scan each window for its max, O(n·k)
- **Better:** a max-heap with lazy removal of out-of-window entries, O(n log n)
- **Insight:** a smaller value to the left of a bigger one can never be a max again, so drop it
- **Steps:** pop smaller values from the back; push i; pop the front if it left the window; front is the max
- **Complexity:** O(n·k) → O(n) time, O(k) space
- **Pitfall:** store indices, not values, so you can tell when the front has slid out of the window
- **Related:** Daily Temperatures, Largest Rectangle in Histogram, Minimum Window Substring
