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

- **Monotonic deque (optimal):** keep indices whose values are *decreasing* from front to back. The front is always the current window's max.
- For each `i`: (1) pop the front if it has left the window (`index ≤ i − k`). (2) Pop from the back while `nums[back] ≤ nums[i]`, since those can never be a max again while `i` is in the window. (3) Push `i`. (4) Once `i ≥ k − 1`, output `nums[front]`.
- O(n) time, because each index is pushed and popped at most once. O(k) space.
- In JavaScript, `Array.prototype.shift` is O(n). Use a head pointer (as in the reference) or a ring buffer for a true O(1) front pop.
- **Heap alternative:** a max-heap of `[value, index]`, lazily discarding the top while its index is out of the window. O(n log n).
- **Baseline:** `Math.max` over each window is O(n · k), too slow when both are large.
- Pitfall: store indices, not values, or you can't tell when the front expired.
- Pitfall: `k = 1` returns the array itself, and `k = n` returns `[max]`.
- Follow-up: sliding window *median* (two heaps with lazy deletion).
