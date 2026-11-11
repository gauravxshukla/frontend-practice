---
title: Jump Game II
type: dsa
difficulty: medium
topic: greedy
order: 3
neetcode: true
tags: [arrays, greedy, bfs]
estimatedMinutes: 20
---

You start at index `0` of `nums`. From index `i` you may jump forward by any amount from 1 up to `nums[i]`.

Return the **minimum number of jumps** needed to reach the last index. The input is guaranteed to make the last index reachable.

```js
function jump(nums) // → number
```

## Examples

```text
Input:  nums = [2,3,1,1,4]
Output: 2
Explanation: Jump 1 step to index 1, then 3 steps to the last index: 2 jumps.

Input:  nums = [2,3,0,1,4]
Output: 2
```

## Constraints

- 1 ≤ `nums.length` ≤ 10⁴
- 0 ≤ `nums[i]` ≤ 1000
- The last index is always reachable.

## Notes

- **Identify:** fewest jumps to the last index → BFS by "levels" of reachable ranges, done greedily
- **Brute force:** try every jump sequence recursively, exponential
- **Better:** DP: jumps[i] = 1 + min over j that reach i, O(n²)
- **Insight:** all indices reachable with k jumps form a window; the next window ends at the farthest jump from it
- **Steps:** for i < n − 1: farthest = max(farthest, i + nums[i]); at the window's end, jumps++, end = farthest
- **Complexity:** exponential → O(n) time, O(1) space
- **Pitfall:** stop before the last index, or you count one jump too many when the window ends there
- **Related:** Jump Game, Binary Tree Level Order Traversal, Gas Station
